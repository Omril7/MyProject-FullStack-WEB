const teachersURL = "https://localhost:7289/api/Teachers";
const studentsURL = "https://localhost:7289/api/Students";

function showPassFunc() {
    const pass = document.getElementById('password');
    const type = pass.getAttribute('type') === 'password' ? 'text' : 'password';
    pass.setAttribute('type', type);
}

function register() {
    const radioButtons = document.getElementsByName('option');
    const name = document.getElementById('name');
    const id = document.getElementById('userId');
    const user = document.getElementById('username');
    const pass = document.getElementById('password');
    if (isValidId(id.value) == false) {
        alert(`ID: ${id.value} is not valid`);
        return;
    }
    if (hasUser(user.value) == true) {
        alert(`user: ${user.value} is already in system, choose another username`);
        return;
    }
    var role = 0;
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            if (radioButtons[i].id === 'isStudent') {
                role = 1;
            }
            break;
        }
    }
    var newUser = { name: name.value, userId: id.value, userName: user.value, password: pass.value, role: role}
    addUser(newUser);
    window.location.href = '../Login/login.html';
}

function isValidId(id) {
    return /^\d{9}$/.test(id);
}

async function hasUser(user) {
    const teacherRes = await fetch(teachersURL);
    const teacherData = await teacherRes.json();

    // Check if user exists
    teacherData.forEach(teacher => {
        if (teacher.userName == user.userName) {
            return true;
        }
    });

    const studentRes = await fetch(studentsURL);
    const studentData = await studentRes.json();
    // Check if user exists
    studentData.forEach(student => {
        if (student.userName == user.userName) {
            return true;
        }
    });
    return false;
}

async function addUser(user) {
    if (user.role == 1) { // Student
        await fetch(studentsURL, {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
    }
    else { // Teacher
        await fetch(teachersURL, {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
    }
    
}