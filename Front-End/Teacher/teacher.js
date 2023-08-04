const teachersURL = "https://localhost:7289/api/Teachers";
const studentsURL = "https://localhost:7289/api/Students";

const user = JSON.parse(sessionStorage.getItem('User'));

async function refreshExamsTable() {
    const studentsIdList = JSON.parse(sessionStorage.getItem('Students'));
    var answeredExams = new Set();
    for (let i=0; i < studentsIdList.length; i++) {
        const examsRes = await fetch(`${studentsURL}/${studentsIdList[i]}/Submissions`);
        const examsData = await examsRes.json();
        for (let j=0; j < examsData.length; j++) {
            answeredExams.add(examsData[j].examId);
        }
    }
    sessionStorage.setItem('AnsweredExams', JSON.stringify(Array.from(answeredExams)));

    // Fetch updated data from the server
    const response = await fetch(`${teachersURL}/${user.id}/Exams`);
    const data = await response.json();

    // Save Exams to localStorage
    sessionStorage.setItem('Exams', JSON.stringify(data));

    setExams(data);
}

function addExam() {
    sessionStorage.setItem('Exam', JSON.stringify({id: 0, name: "", examId: "", examDate: "", teacherName: "", totalTime: "2", isOrderRandom: true, questions: []}));
    window.location.href = "../ExamBuilder/examBuilder.html"
}

function showStats(id) {
    const exams = JSON.parse(sessionStorage.getItem('Exams'));
    exams.forEach(exam => {
        if (exam.id === id) {
            sessionStorage.setItem('Exam', JSON.stringify(exam));
            window.location.href = '../TeacherStats/teacherStats.html';
        }
    });
}

async function editExam(examId) {
    const exams = JSON.parse(sessionStorage.getItem('Exams'));
    exams.forEach(exam => {
        if (exam.id === examId) {
            sessionStorage.setItem('Exam', JSON.stringify(exam));
            window.location.href = '../ExamBuilder/examBuilder.html';
        }
    });
}

async function deleteExam(examId) {
    if (confirm("Are you sure you want to delete this exam?")) {
        const response = await fetch(`${teachersURL}/${user.id}/Exams/${examId}`, {
            method: "DELETE"
        });
        
        if (response.ok) {
            refreshExamsTable();
        }
        else {
            throw new Error('Failed to delete exam');
        }
    }
}

function search() {
    const exams = JSON.parse(sessionStorage.getItem('Exams'));
    let query = searchInput.value;
    const filteredExams = exams.filter(exam => exam.name.toLowerCase().includes(query.toLowerCase()));
    setExams(filteredExams);
}

function setExams(data) {
    var answeredExams = JSON.parse(sessionStorage.getItem('AnsweredExams'));
    // Generate new HTML for the table
    var i = 0;
    var addingData = '';
    data.forEach(exam => {
        if (i % 2 == 0) {
            addingData += `<tr class="table-active" id="${exam.examId}">`;
        }
        else {
            addingData += `<tr class="table-default" id="${exam.examId}">`;
        }
        addingData += `<td scope="row">${exam.name}</td>`;
        addingData += `<td>${exam.examId}</td>`;
        const date = new Date(exam.examDate);
        addingData += `<td>${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}</td>`;
        addingData += `<td>${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}</td>`;
        if (examIsAnswered(answeredExams, exam.examId) === true) {
            addingData +=   `<td>
                                <button type="button" class="btn btn-info" onclick="showStats(${exam.id})">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bar-chart" viewBox="0 0 16 16">
                                        <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                                    </svg>
                                </button>
                            </td>`;
            addingData +=   `<td>
                                <button type="button" class="btn btn-outline-warning" disabled>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                    </svg>
                                </button>
                            </td>`;
        }
        else {
            addingData +=   `<td>
                                <button type="button" class="btn btn-outline-info" disabled>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bar-chart" viewBox="0 0 16 16">
                                        <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                                    </svg>
                                </button>
                            </td>`;
            addingData +=   `<td>
                                <button type="button" class="btn btn-warning" onclick="editExam(${exam.id})">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                    </svg>
                                </button>
                            </td>`;
        }
        addingData +=   `<td>
                            <button type="button" class="btn btn-danger" onclick="deleteExam(${exam.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                </svg>
                            </button>
                        </td>`;
        addingData +=  '</tr>';
        i++;
    });

    // Replace the existing HTML with the new one
    const tableTbody = document.getElementById('tableExamsTbody');
    tableTbody.innerHTML = addingData;
}

function examIsAnswered(answeredExams, examId) {
    for (let i=0; i<answeredExams.length; i++) {
        if (answeredExams[i] === examId) {
            return true;
        }
    }
    return false;
}

function exitWindow() {
    sessionStorage.removeItem('AnsweredExams');
    sessionStorage.removeItem('Students');
    sessionStorage.removeItem('User');
    sessionStorage.removeItem('Exams');
}