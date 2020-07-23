$('#navbar').load('navbar.html');
const devices = JSON.parse(localStorage.getItem('devices')) || [];
const users = JSON.parse(localStorage.getItem('users')) || [];

devices.push({
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

devices.forEach(function (device) {
    $('#devices tbody').append(`
        <tr>
            <td>${device.user}</td>
            <td>${device.name}</td>    
        </tr>`);
});

$('#add-device').on('click', function () {
    const user = $('#user').val();
    const name = $('#name').val();
    devices.push({
        user,
        name
    });
    localStorage.setItem('devices', JSON.stringify(devices));
    location.href = '/';
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
    if(users.find(user => user.name === username && user.password === passwordcheck)){
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