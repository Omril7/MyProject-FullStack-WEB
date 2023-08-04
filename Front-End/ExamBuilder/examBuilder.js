const teachersURL = "https://localhost:7289/api/Teachers";
const user = JSON.parse(sessionStorage.getItem('User'));
const exams = JSON.parse(sessionStorage.getItem('Exams'));
const exam = JSON.parse(sessionStorage.getItem('Exam'));

function loaded() {
    document.getElementById('teacherName').value = user.name;
    document.getElementById('examName').value = exam.name;
    document.getElementById('totalTime').value = exam.totalTime;
    document.getElementById("isRandomQuestions").checked = exam.isOrderRandom;
    if (exam.id != 0) {
        document.getElementById('examId').value = exam.examId;
        const date = new Date(exam.examDate);
        document.getElementById('examDate').valueAsDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
        document.getElementById('examTime').value = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    else {
        document.getElementById('examDate').valueAsDate = new Date();
        document.getElementById('examId').value = uuidv4();
    }
    totalTimeInput();
    refreshQuestionsTable();
}

function refreshQuestionsTable() {
    // Generate new HTML for the table
    var i = 0;
    var addingData = '';
    exam.questions.forEach(question => {
        if (i % 2 == 0) {
            addingData += `<tr class="table-active" id="${question.text}">`;
        }
        else {
            addingData += `<tr class="table-default" id="${question.text}">`;
        }
        addingData += `<td scope="row">${question.text}</td>`;
        addingData += `<td><input class="form-check-input" type="checkbox" value="" id="${question.text}CheckBox"`;
        if (question.isRand == true) {
            addingData += ' checked=""';
        }
        addingData += '></td>';
        addingData +=   `<td>
                            <button type="button" class="btn btn-outline-danger" onclick="deleteQuestion(${question.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                </svg>
                            </button>
                        </td>`;
        addingData += '</tr>';
        i++;
    });

    // Replace the existing HTML with the new one
    const tableTbody = document.getElementById('tableQuestionsTbody');
    tableTbody.innerHTML = addingData;
}

function submitExam() {
    setData();
    if (exam.id != 0) {
        for (let i = 0; i<exams.length; i++) {
            if (exams[i].id == exam.id) {
                exams.splice(i, 1);
            }
        }
        putExam();
    }
    else {
        postExam();
    }
}

function addQuestion() {
    var text = document.getElementById('questionTitle');
    if(text.value === '') {
        alert('Please write title for Question');
        return;
    }
    var rows = document.querySelectorAll('#tableAnswersTbody tr');
    
    if(rows.length < 2) {
        alert('Please write at least 2 Answers');
        return;
    }
    var rand = document.getElementById('isRand');
    var arr = [];

    for (var i = 0; i < rows.length; i++) {
        var td1 = rows[i].querySelector('td:first-child').innerHTML;
        var td2 = rows[i].querySelector('td:nth-child(2) input').checked;
        var obj = { id: 0, text: td1, isCorrect: td2 };
        arr.push(obj);
    }

    var question = { id: 0, text: text.value, isRand: rand.checked, answers: arr };
    
    exam.questions.push(question);
    sessionStorage.setItem('Exam', JSON.stringify(exam));
    refreshQuestionsTable();
    document.getElementById('tableAnswersTbody').innerHTML = '';
    text.value = '';
}

function deleteQuestion(questionId) {
    if (confirm("Are you sure you want to delete this question?")) {
        for (let i=0; i < exam.questions.length; i++) {
            if (exam.questions[i].id == questionId) {
                exam.questions.splice(i, 1);
                sessionStorage.setItem('Exam', JSON.stringify(exam));
                refreshQuestionsTable();
                break;
            }
        }
    }
}

let count = 1;
function addAnswer() {
    const answer = document.getElementById('inputAnswer').value;
    if (answer === '') {
        return;
    }
    var addingData = '';
    if (count % 2 == 0) {
        addingData += `<tr class="table-active" id="option${count}TR">`;
    }
    else {
        addingData += `<tr class="table-default"  id="option${count}TR">`;
    }
    addingData += `<td scope="row">${answer}</td>`;
    addingData += `<td><input class="form-check-input" type="radio" value="option${count}" name="group" id="answer${count}" checked=""></td>`;
    addingData += `<td><button type="button" class="btn btn-outline-danger" onclick="deleteAnswer(option${count}TR)">Delete</button></td>`;
    addingData += '</tr>';
    const tableTbody = document.getElementById('tableAnswersTbody');
    tableTbody.innerHTML += addingData;
    count++;
    document.getElementById('inputAnswer').value = "";
}

function deleteAnswer(trId) {
    var table = document.getElementById('tableAnswersTbody');
    table.removeChild(trId);
}


function exitWindow() {
    sessionStorage.removeItem('Students');
    sessionStorage.removeItem('AnsweredExams');
    sessionStorage.removeItem('User');
    sessionStorage.removeItem('Exams');
    sessionStorage.removeItem('Exam');
}

function uuidv4() {
    const hexValues = '0123456789abcdef';
    let uuid = '';
    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid += '-';
        } else if (i === 14) {
            uuid += '4';
        } else {
            uuid += hexValues[Math.floor(Math.random() * 16)];
        }
    }
    return uuid;
}

function totalTimeInput() {
    function convertToTime(hours) {
        const decimalHours = Math.floor(hours);
        const decimalMinutes = Math.round((hours - decimalHours) * 59);
        const paddedMinutes = decimalMinutes < 10 ? `0${decimalMinutes}` : decimalMinutes;
        return `${decimalHours}:${paddedMinutes}`;
    }
    const totalTimeValue = document.getElementById('totalTimeValue');
    const totalTime = document.getElementById('totalTime');
    totalTimeValue.value = convertToTime(totalTime.value);
}

function setData() {
    exam.name = document.getElementById('examName').value;
    exam.examId = document.getElementById('examId').value;
    exam.examDate = makeDate();
    exam.teacherName = document.getElementById('teacherName').value;
    exam.totalTime = document.getElementById('totalTime').value;
    exam.isOrderRandom = document.getElementById('isRandomQuestions').checked;
}

function makeDate() {
    var currentTime = document.getElementById('examTime').value;
    const inputTime = new Date();
    inputTime.setHours(currentTime.substring(0, 2)); // Set the hours portion of the Date object
    inputTime.setMinutes(currentTime.substring(3, 5)); // Set the minutes portion of the Date object
    inputTime.setSeconds(0);

    const lowerBound = new Date();
    lowerBound.setHours(9, 0, 0); // Set the lower bound to 09:00:00
    const upperBound = new Date();
    upperBound.setHours(16, 0, 0); // Set the upper bound to 16:00:00
    
    if (inputTime < lowerBound) {
        currentTime = '09:00';
    }
    else if(inputTime > upperBound) {
        currentTime = '16:00';
    }
    const date = new Date();
    date.setHours(currentTime.substring(0, 2));
    date.setMinutes(currentTime.substring(3, 5));
    date.setHours(date.getHours() + 3);
    var hours = date.getHours().toString().padStart(2, "0");
    var minutes = date.getMinutes().toString().padStart(2, "0");
    return new Date(document.getElementById('examDate').value + ' ' + hours + ':' + minutes);
}

function postExam() {
    fetch(`${teachersURL}/${user.id}/Exams`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(exam)
    })
    .then(response => {
        console.log("Exam created successfully");
        exams.push(exam);
        sessionStorage.setItem('Exams', JSON.stringify(exams));
        sessionStorage.removeItem('Exam');
        window.location.href = "../Teacher/teacher.html";
    //     if (response.ok) {
    //         console.log("Exam created successfully");
    //         exams.push(exam);
    //         sessionStorage.setItem('Exams', JSON.stringify(exams));
    //         sessionStorage.removeItem('Exam');
    //         window.location.href = "../Teacher/teacher.html";
    //     } 
    //     else {
    //         throw new Error("Exam creation failed");
    //     }
    // })
    // .catch(error => {
    //     console.error("Error:", error);
    });
}

function deleteExam(examId) {
    fetch(`${teachersURL}/${user.id}/Exams/${examId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            console.log("Exam deleted successfully");
        } else {
            throw new Error("Exam deletion failed");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function putExam() {
    fetch(`${teachersURL}/${user.id}/Exams/${exam.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(exam)
    })
    .then(response => {
        if (response.ok) {
            console.log("Exam updated successfully");
            exams.push(exam);
            sessionStorage.setItem('Exams', JSON.stringify(exams));
            sessionStorage.removeItem('Exam');
            window.location.href = "../Teacher/teacher.html";
        } 
        else {
            throw new Error("Exam update failed");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function fromAPI() {
    setData();
    sessionStorage.setItem('Exam', JSON.stringify(exam));
    window.location.href = '../QuizApi/quizApi.html';
}