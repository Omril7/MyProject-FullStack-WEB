const studentsURL = 'https://localhost:7289/api/Students';

const user = JSON.parse(sessionStorage.getItem('User'));
const exam = JSON.parse(sessionStorage.getItem('Exam'));

const correctAnswers = {};
const userAnswers = {};
exam.questions.forEach(question => {
    question.answers.forEach(answer => {
        userAnswers[question.id] = 0;
        if (answer.isCorrect) {
            correctAnswers[question.id] = answer.id;
        }
    });
});

var countdownTime = new Date();
countdownTime.setHours(countdownTime.getHours() + Math.floor(exam.totalTime));
countdownTime.setMinutes(countdownTime.getMinutes() + Math.floor((exam.totalTime - Math.floor(exam.totalTime)) * 60));

function loaded() {
    document.getElementById('n').textContent = exam.questions.length;
    if (exam.isOrderRandom) {
        exam.questions = shuffleArray(exam.questions);
    }
    var addedData = '';
    for (let i=0; i < exam.questions.length; i++) {
        var question = exam.questions[i];
        if (question.isRand) {
            exam.questions[i].answers = shuffleArray(exam.questions[i].answers);
        }
        if (i % 2 == 0) {
            addedData += `<tr class="table-active" id="${question.id}">`;
        }
        else {
            addedData += `<tr class="table-default" id="${question.id}">`;
        }
        addedData += `<td scope="row">Question ${i+1}</td>`;
        addedData += `<td><button type="button" id="${i}" class="btn btn-outline-info" onclick="setQuestion(${question.id}, ${i});">Show</button></td></tr>`;
    }
    document.getElementById('tableQuestionsTbody').innerHTML = addedData;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

function setQuestion(questionId, i) {
    for (let i=0; i<exam.questions.length; i++) {
        if (exam.questions[i].id == questionId) {
            const question = exam.questions[i];
            var innerData = `<fieldset class="form-group">
                                <h5 class="my-4">Question ${i+1}</h5>`;
            innerData += `<legend class="mb-4">${getProperString(question.text)}</legend>`;
            question.answers.forEach( answer => {
                innerData += '<div class="form-check">';
                if (userAnswers[questionId] === answer.id) {
                    innerData += `<input class="form-check-input" type="radio" name="optionsRadios" id="optionsRadios${answer.id}" value="option${answer.id}" 
                                         onclick="selectAnswer(${questionId}, ${answer.id}, ${i});" checked="">`;
                }
                else {
                    innerData += `<input class="form-check-input" type="radio" name="optionsRadios" id="optionsRadios${answer.id}" value="option${answer.id}"
                                         onclick="selectAnswer(${questionId}, ${answer.id}, ${i});" >`;
                }
                innerData += `<label class="form-check-label" for="optionsRadios${answer.id}">`;
                innerData += getProperString(answer.text);
                innerData += '</label></div>'
            });
            innerData += '</fieldset>';
            document.getElementById('singleQuestion').innerHTML = innerData;
            break;
        }
    }
}

function getProperString(string) {
    return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function selectAnswer(questionId, answerId, i) {
    if (userAnswers[questionId] === 0) {
        let k = parseInt(document.getElementById('k').textContent);
        document.getElementById('k').textContent = `${k + 1}`;
        document.getElementById(`${i}`).classList.remove('btn-outline-info')
        document.getElementById(`${i}`).classList.add('btn-info')
    }
    userAnswers[questionId] = answerId;
}

function finishExam() {
    let submit = {id : 0,
                  name : user.name,
                  examId : exam.examId,
                  grade : 0,
                  errors : []};
    let count = 0;
    exam.questions.forEach(question => {
        if (userAnswers[question.id] === correctAnswers[question.id]) { // correct answer
            count++;
        }
        else {
            let error = {id : 0,
                         questionTitle : question.text, 
                         chosenAnswer : "",
                         correctAnswer : ""};
            for (let i=0; i<question.answers.length; i++) {
                if (question.answers[i].id == userAnswers[question.id]) {
                    error.chosenAnswer = question.answers[i].text;
                }
                if (question.answers[i].id == correctAnswers[question.id]) {
                    error.correctAnswer = question.answers[i].text;
                }
            }
            if (error.chosenAnswer === "") {
                error.chosenAnswer = 'No Answer chosen';
            }
            submit.errors.push(error);
        }
    });
    var totalQuestions = exam.questions.length;
    submit.grade = (count / totalQuestions) * 100;
    submit.grade = submit.grade.toFixed(0)
    
    console.log(submit);

    // the POST call is posting to DB ***BUT*** throws error (line 124)

    fetch(`${studentsURL}/${user.id}/Submissions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submit)
    })
    .then(response => {
        console.log("Submission created successfully");
        backWindow();
        window.location.href = '../Student/student.html';
    //     if (response.ok) {
    //         console.log("Submission created successfully");
    //         backWindow();
    //         window.location.href = '../Student/student.html';
    //     } 
    //     else {
    //         throw new Error("Submission creation failed");
    //     }
    // });
    // .catch(error => {
    //     console.error("Error:", error);
    });
}

// Update the timer every second
var intervalId = setInterval(updateTimer, 1000);

function updateTimer() {
    var now = new Date();

    // Calculate the remaining time
    var remainingTime = countdownTime - now;

    // Time is OVER
    if (remainingTime <= 0) {
        document.getElementById('timer').innerHTML = '0:00:00';

        // Clear the interval by passing the interval ID to clearInterval
        clearInterval(intervalId);

        alert('Time is up!');
        finishExam();

        return;
    }

    // 5 Minutes is left
    if (remainingTime > 60000 && remainingTime <= 300000) {
        document.getElementById('timerC').classList.remove('text-success');
        document.getElementById('timerC').classList.add('text-warning');
    }

    // Last Minute
    if (remainingTime <= 60000) {
        document.getElementById('timerC').classList.remove('text-warning');
        document.getElementById('timerC').classList.add('text-danger');

    }

    // Convert remaining time to hours, minutes abd seconds
    var hours = Math.floor(remainingTime / (1000 * 60 * 60));
    var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    // Fromat the time as HH:MM:SS
    var formattedTime = hours.toString().padStart(2, '0') + ':' +
                        minutes.toString().padStart(2, '0') + ':' +
                        seconds.toString().padStart(2, '0');

    document.getElementById('timer').innerHTML = formattedTime;
}

function backWindow() {
    sessionStorage.removeItem('Exam');
}

function exitWindow() {
    sessionStorage.removeItem('User');
    sessionStorage.removeItem('Exams');
    sessionStorage.removeItem('Exam');
    sessionStorage.removeItem('Teachers');
    sessionStorage.removeItem('Submits');
}