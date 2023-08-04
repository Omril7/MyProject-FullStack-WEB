const studentsURL = "https://localhost:7289/api/Students";

const user = JSON.parse(sessionStorage.getItem('User'));
const exams = JSON.parse(sessionStorage.getItem('Exams'));
const exam = JSON.parse(sessionStorage.getItem('Exam'));

async function loaded() {
    const studentsIdList = JSON.parse(sessionStorage.getItem('Students'));
    var submissions = [];
    for (let i=0; i < studentsIdList.length; i++) {
        const submitsRes = await fetch(`${studentsURL}/${studentsIdList[i]}/Submissions`);
        const submitsData = await submitsRes.json();
        for (let j=0; j < submitsData.length; j++) {
            if (submitsData[j].examId === exam.examId) {
                submissions.push(submitsData[j]);
            }
        }
    }
    submissions.sort(compareGrades);

    document.getElementById('examName').innerHTML = exam.name;
    var addingData = '';
    let grades = [];
    let average = 0;
    for (let i=0; i<submissions.length; i++) {
        if (i % 2 == 0) {
            addingData += `<tr class="table-active" id="${exam.examId}">`;
        }
        else {
            addingData += `<tr class="table-default" id="${exam.examId}">`;
        }
        addingData += `<td scope="row">${submissions[i].name}</td>`;
        if(submissions[i].grade >= 56) {
            addingData += `<td class="text-success">${submissions[i].grade.toFixed(0)}</td>`;
        }
        else {
            addingData += `<td class="text-danger">${submissions[i].grade.toFixed(0)}</td>`;
        }
        
        addingData += '</tr>';
        grades.push({name : submissions[i].name, grade : submissions[i].grade});
        average += submissions[i].grade;
    }
    average /= submissions.length;
    if (average < 56) {
        document.getElementById('average').classList.remove('text-success');
        document.getElementById('average').classList.add('text-danger');
    }
    document.getElementById('average').innerHTML = average.toFixed(2);
    // Replace the existing HTML with the new one
    const tableTbody = document.getElementById('tableTbody');
    tableTbody.innerHTML = addingData;

    var averageList = [];

    for( let i=0; i < grades.length; i++) {
        averageList.push(average);
    }

    const ctx = document.getElementById('gradeChart').getContext('2d');

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: grades.map(obj => obj.name),
            datasets: [{
                    label: 'Grade',
                    data: grades.map(obj => obj.grade),
                    fill: false,
                    backgroundColor: 'rgb(54, 162, 235)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1,
                    pointStyle: 'rectRot',
                    pointRadius: 5,
                    pointBorderColor: 'rgb(0, 0, 0)' 
                }, 
                {
                    label: 'Average',
                    data: averageList,
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
                    pointRadius: 0
                }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                    }
                }
            },
            scales: {
                y: {
                    display: true,
                    ticks: {
                        stepSize: 10
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });

}

function compareGrades(a, b) {
    if (a.grade < b.grade) {
      return -1;
    }
    if (a.grade > b.grade) {
      return 1;
    }
    return 0;
}

function exitWindow() {
    sessionStorage.removeItem('Students');
    sessionStorage.removeItem('AnsweredExams');
    sessionStorage.removeItem('User');
    sessionStorage.removeItem('Exams');
    sessionStorage.removeItem('Exam');
}