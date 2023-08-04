const APIKey = '88w1ouN0hcRi48rDiLRhoS0tbx9ZZdCfdACya373';
const exam = JSON.parse(sessionStorage.getItem('Exam'));

const getFromAPI = async () => {
    var catS = document.getElementById('category');
    var category = catS.options[catS.selectedIndex].text;
    if(category === 'Any Category') {}
    var difS = document.getElementById('difficulty');
    var difficulty = difS.options[difS.selectedIndex].text;
    var noqS = document.getElementById('numOfQuestions');
    var noq = noqS.options[noqS.selectedIndex].text;
    var url = `https://quizapi.io/api/v1/questions?apiKey=${APIKey}`
    if(category !== 'Any Category') {
        url += `&category=${category.toLowerCase()}`;
    }
    if(difficulty !== 'Any Difficulty') {
        url += `&difficulty=${difficulty}`;
    }
    url += `&limit=${noq}`;
    
    const response = await fetch(url);
    const data = await response.json();
    sessionStorage.setItem('QuizAPI', JSON.stringify(data));

    // Generate new HTML for the table
    var i = 0;
    var addingData = '';
    data.forEach(question => {
        if(i%2 ==0) {
            addingData += '<tr class="table-active">';
        }
        else {
            addingData += '<tr class="table-default">';
        }
        addingData += `<td scope="row">${getProperString(question.question)}</td>`;

        addingData += '<td><ul>';
        let options = ['a', 'b', 'c', 'd', 'e', 'f'];
        options.forEach( c => {
            let answerKey = `answer_${c}`;
            let answerValue = `answer_${c}_correct`;
            if (question.answers[answerKey] !== null && question.correct_answers[answerValue] === 'true') {
                addingData += `<li style="color : green;">${getProperString(question.answers[answerKey])}</li>`;
            }
            else if (question.answers[answerKey] !== null && question.correct_answers[answerValue] === 'false') {
                addingData += `<li style="color : red;">${getProperString(question.answers[answerKey])}</li>`;
            }
        });
        addingData += '</ul></td>';
        addingData += `<td><button type="button" class="btn btn-success" onclick="addQuestion(${question.id})">Add</button></td>`;
        addingData += '</tr>';
        i++;
    });
    var tBody = document.getElementById('tBody');
    tBody.innerHTML = addingData;
}

function addQuestion(questionId) {
    let questions = JSON.parse(sessionStorage.getItem('QuizAPI'));
    for (let i=0; i<questions.length; i++) {
        if (questions[i].id == questionId) {
            if (questions[i].multiple_correct_answers === 'true') {
                alert('No multiple correct answers');
                return;
            }
            let question = {id : 0, text : questions[i].question, isRand : true, answers : []};
            let options = ['a', 'b', 'c', 'd', 'e', 'f'];
            options.forEach( c => {
                let answerKey = `answer_${c}`;
                let answerValue = `answer_${c}_correct`;
                if (questions[i].answers[answerKey] !== null && questions[i].correct_answers[answerValue] === 'true') {
                    question.answers.push({id : 0, text : questions[i].answers[answerKey], isCorrect : true});
                }
                else if (questions[i].answers[answerKey] !== null && questions[i].correct_answers[answerValue] === 'false') {
                    question.answers.push({id : 0, text : questions[i].answers[answerKey], isCorrect : false});
                }
            });
            exam.questions.push(question);
            alert('Question Added succesfully!');
            return;
        }
    }
}

function getProperString(string) {
    return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function back() {
    sessionStorage.setItem('Exam', JSON.stringify(exam));
    sessionStorage.removeItem('QuizAPI');
    window.location.href = '../ExamBuilder/examBuilder.html';
}

function exitWindow() {
    sessionStorage.removeItem('Students');
    sessionStorage.removeItem('AnsweredExams');
    sessionStorage.removeItem('QuizAPI');
    sessionStorage.removeItem('User');
    sessionStorage.removeItem('Exams');
    sessionStorage.removeItem('Exam');
}