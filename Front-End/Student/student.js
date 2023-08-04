const teachersURL = "https://localhost:7289/api/Teachers";
const studentsURL = "https://localhost:7289/api/Students";
const user = JSON.parse(sessionStorage.getItem('User'));

async function loaded() {
    const teachersIdList = JSON.parse(sessionStorage.getItem('Teachers'));
    var allExams = [];
    for (let i=0; i < teachersIdList.length; i++) {
        const examsRes = await fetch(`${teachersURL}/${teachersIdList[i]}/Exams`);
        const examsData = await examsRes.json();
        for (let j=0; j < examsData.length; j++) {
            allExams.push(examsData[j]);
        }
    }
    // Save Exams to sessionStorage
    sessionStorage.setItem('Exams', JSON.stringify(allExams));

    const submitsRes = await fetch(`${studentsURL}/${user.id}/Submissions`);
    const submitsData = await submitsRes.json();

    // Save Exams to sessionStorage
    sessionStorage.setItem('Submits', JSON.stringify(submitsData));

    let sum = 0;
    for (let i=0; i<submitsData.length; i++) {
        sum += submitsData[i].grade;
    }
    let avg;
    if (submitsData.length > 0) {
        avg = (sum / submitsData.length);
    }
    else {
        avg = 0;
    }
    document.getElementById('avg').innerHTML = ' ' + avg.toFixed(2);
    
    if (avg < 56) {
        document.getElementById('avg').classList.remove('text-success');
        document.getElementById('avg').classList.add('text-danger');
    }

    setExams(allExams);
}

function setExams(exams) {
    // Generate new HTML for the table
    var i = 0;
    var addingData = '';
    exams.forEach(exam => {
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
        if (examIsAnswered(exam.examId)) {
            addingData += `<td><button type="button" class="btn btn-outline-success" disabled>Start Exam</button></td>`;
            addingData += `<td><button type="button" class="btn btn-info" onclick="ShowExam('${exam.examId}');">Exam Stats</button></td>`;
        }
        else {
            addingData += `<td><button type="button" class="btn btn-success" onclick="startExam(${exam.id});">Start Exam</button></td>`;
            addingData += `<td><button type="button" class="btn btn-outline-info" disabled>Exam Stats</button></td>`;
        }
        addingData += '</tr>';
        i++;
    });
    // Replace the existing HTML with the new one
    const tableTbody = document.getElementById('tableExamsTbody');
    tableTbody.innerHTML = addingData;
}

function startExam(examId) {
    const exams = JSON.parse(sessionStorage.getItem('Exams'));
    for (let i=0; i < exams.length; i++) {
        if (exams[i].id === examId) {
            sessionStorage.setItem('Exam', JSON.stringify(exams[i]));
            break;
        }
    }
    /*
    if (!timeCorrect(exam)) {
        return;
    }
    */
    window.location.href = '../Exam/exam.html';
}

function examIsAnswered(examId) {
    const submits = JSON.parse(sessionStorage.getItem('Submits'));
    for (let i=0; i < submits.length; i++) {
        if (submits[i].examId === examId) {
            return true;
        }
    }
    // Check in Submmission if examId is there
    return false;
}

function ShowExam(examId) {
    const submits = JSON.parse(sessionStorage.getItem('Submits'));
    for (let i=0; i < submits.length; i++) {
        if (submits[i].examId === examId) {
            sessionStorage.setItem('Submit', JSON.stringify(submits[i]));
            break;
        }
    }
    window.location.href = '../Stats/stats.html';
}

function timeCorrect(exam) {
    var myDate = exam.examDate;
    var currentDate = new Date();
    var maxDate = new Date();
    maxDate.setHours(maxDate.getHours() + exam.totalTime);

    if (myDate > currentDate && myDate > maxDate) {
        alert('You missed the Exam Date!');
        return false;
    } 
    else if (myDate < currentDate) {
        alert('Wait for the Exam to Start!');
        return false;
    } 
    return true;
}

function search() {
    const exams = JSON.parse(sessionStorage.getItem('Exams'));
    let query = searchInput.value;
    const filteredExams = exams.filter(exam => exam.name.toLowerCase().includes(query.toLowerCase()));
    setExams(filteredExams);
}

function exitWindow() {
    sessionStorage.removeItem('User');
    sessionStorage.removeItem('Exams');
    sessionStorage.removeItem('Teachers');
    sessionStorage.removeItem('Submits');
}