const teachersURL = "https://localhost:7289/api/Teachers";
const studentsURL = "https://localhost:7289/api/Students";

const username = document.getElementById('username');
const pass = document.getElementById('password');
const radioButtons = document.getElementsByName('option');

function showPassFunc() {
    const type = pass.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
}

function colorChange() {
    const myCard = document.getElementById('myCard');
    if (pass.value == "") {
        myCard.classList.remove('border-danger');
        myCard.classList.add('border-info');
    }
    else if (pass.value.length < 4) {
        myCard.classList.remove('border-info');
        myCard.classList.add('border-danger');
    }
    else {
        myCard.classList.remove('border-danger');
        myCard.classList.add('border-success');
    }
}

async function checkData() {
    var user = null;
    var found = false;

    const teacherRes = await fetch(teachersURL);
    const teacherData = await teacherRes.json();
    var teachersIdList = [];
    for (let i = 0; i < teacherData.length; i++) {
        if (teacherData[i].userName == username.value) {
            if (teacherData[i].password == pass.value) {
                user = teacherData[i];
                found = true;
                break;
            }
            else {
                alert('Wrong Password! Try again..');
                pass.value = '';
                return;
            }
        }
        teachersIdList.push(teacherData[i].id);
    };
    const studentRes = await fetch(studentsURL);
    const studentData = await studentRes.json();
    var studentsIdList = [];
    for (let i = 0; i < studentData.length; i++) {
        if (found === false) {
            if (studentData[i].userName == username.value) {
                if (studentData[i].password == pass.value) {
                    user = studentData[i];
                    break;
                }
                else {
                    alert('Wrong Password! Try again..');
                    pass.value = '';
                    return;
                }
            }
        }
        studentsIdList.push(studentData[i].id);
    };
    if( user === null) {
        alert('No such user in system, please sign up');
        username.value = '';
        pass.value = '';
        return;
    }

    sessionStorage.setItem('User', JSON.stringify(user));

    if( user.role == 1 ) { // Student
        sessionStorage.setItem('Teachers', JSON.stringify(teachersIdList));
        window.location.href = '../Student/student.html';
    }
    if( user.role == 0 ) { // Teacher
        sessionStorage.setItem('Students', JSON.stringify(studentsIdList));
        window.location.href = '../Teacher/teacher.html';
    }
}