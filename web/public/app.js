$('#navbar').load('navbar.html');
const API_URL = 'http://localhost:5000/api';

const users = JSON.parse(localStorage.getItem('users')) || [];
$.get(`${API_URL}/devices`).then(response => {
    response.forEach(device => {
        $('#devices tbody').append(`
            <tr>       
                <td>${device.user}</td> 
                <td>${device.name}</td>
            </tr>`);
    });
}).catch(error => {
    console.error(`Error: ${error}`);
});

/* devices.push({
    user: "Mary",
    name: "Mary's iPhone"
});
devices.push({
    user: "Alex",
    name: "Alex's Surface Pro"
});
devices.push({
    user: "Mary",
    name: "Mary's MacBook"
});
 */


$('#add-device').on('click', () => {
    const name = $('#name').val();
    const user = $('#user').val();
    const sensorData = [];
    const body = {
        name,
        user,
        sensorData
    };
    $.post('${API_URL}/devices', body).then(response => {
        location.href = '/';
    }).catch(error => {
        console.error(`Error: ${error}`);
    });
});

$('#send-command').on('click', function () {
    const command = $('#command').val();
    console.log(`command is: ${command}`);
});

$('#register').on('click', function () {
    const username = $('#user').val();
    const password = $('#password').val();
    const confirm = $('#confirm').val();
    const exists = users.find(user => user.name === username);
    if (exists == undefined) {
        if (password == confirm) {
            users.push({
                name: username,
                password: password
            });
            localStorage.setItem('users', JSON.stringify(users));
            location.href = '/login';
        } else {
            $('label[for=message]').text("Password doesn't match correct");
        }

    } else {
        $('label[for=message]').text("Name already in use please choose another one");
    }
});

$('#login').on('click', function () {
    const username = $('#username').val();
    const passwordcheck = $('#password').val();
    if (users.find(user => user.name === username && user.password === passwordcheck)) {
        localStorage.setItem("isAuthenticated", "true");
        location.href = '/';
    } else {
        $('label[for=message]').text("Error");
    }
});

const logout = () => {
    localStorage.removeItem('isAuthenticated');
    location.href = '/login';
}


$('#footer').load('footer.html');