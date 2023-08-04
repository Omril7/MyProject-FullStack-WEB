const user = JSON.parse(sessionStorage.getItem('User'));
const submit = JSON.parse(sessionStorage.getItem('Submit'));

function loaded() {
    var exams = JSON.parse(sessionStorage.getItem('Exams'));
    for (let i=0; i< exams.length; i++) {
        if (exams[i].examId === submit.examId) {
            document.getElementById('title').innerHTML += exams[i].name;
            break;
        }
    }
    
    const grade = document.getElementById('grade');
    if (submit.grade < 56) {
        grade.classList.remove('text-success');
        grade.classList.add('text-danger');
    }
    grade.innerHTML = `${submit.grade.toFixed(0)}`;
    
    // Generate new HTML for the table
    var i = 0;
    var addingData = '';
    submit.errors.forEach(err => {
        if (i % 2 == 0) {
            addingData += `<tr class="table-active">`;
        }
        else {
            addingData += `<tr class="table-default">`;
        }
        addingData += `<td scope="row">${err.questionTitle}</td>`;
        addingData += `<td><p class="text-danger">${err.chosenAnswer}</p></td>`;
        addingData += `<td><p class="text-success">${err.correctAnswer}</p></td>`;
        addingData += '</tr>';
        i++;
    });
    // Replace the existing HTML with the new one
    const tableTbody = document.getElementById('tableErrorsTbody');
    tableTbody.innerHTML = addingData;
}

function backWindow() {
    sessionStorage.removeItem('Submit');
}

function exitWindow() {
    sessionStorage.removeItem('User');
    sessionStorage.removeItem('Submit');
    sessionStorage.removeItem('Exams');
    sessionStorage.removeItem('Teachers');
    sessionStorage.removeItem('Submits');
}