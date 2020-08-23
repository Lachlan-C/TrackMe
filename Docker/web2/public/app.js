$('#navbar').load('navbar.html');
const API_URL = 'http://45.79.237.23/api';
const MQTT_URL = 'http://172.105.167.235/send-command';

/* $.use(express.static('public'));
$.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); */

const currentUser = localStorage.getItem('user');
if (currentUser) {
    $.get(`${API_URL}/users/${currentUser}/devices`).then(response => {
        response.forEach((device) => {
            $('#devices tbody').append(`
                <tr data-device-id=${device._id}>
                <td>${device.user}</td>
                <td>${device.name}</td>        
            </tr>`);
        });
        $('#devices tbody tr').on('click', (e) => {
            const deviceId = e.currentTarget.getAttribute('data-device-id');
            $.get(`${API_URL}/devices/${deviceId}/device-history`).then(response => {
                response.map(sensorData => {
                    $('#historyContent').append(`    
                        <tr>      
                            <td>${sensorData.ts}</td>
                            <td>${sensorData.temp}</td>
                            <td>${sensorData.loc.lat}</td>
                            <td>${sensorData.loc.lon}</td>
                        </tr>  
                    `);
                });
                $('#historyModal').modal('show');
            });
        });

    }).catch(error => {
        console.error(`Error: ${error}`);
    });
} else {
    const path = window.location.pathname;
    if (path !== '/login' && path !== '/registration') {
        location.href = '/login';
    }
}



/* const users = JSON.parse(localStorage.getItem('users')) || [];
$.get(`${API_URL}/devices`).then(response => {
    response.forEach(device => {
        $('#devices tbody').append(`
            <tr>       
                <td>${device.user}</td> 
                <td>${device.name}</td>
            </tr>`);
    }).catch(error => {
        console.error(`Error: ${error}`);
    });
}); */

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
    $.post(`${API_URL}/devices`, body).then(response => {
        location.href = '/';
    }).catch(error => {
        console.error(`Error: ${error}`);
    });
});

$('#send-command').on('click', function () {
    const command = $('#command').val();
    const deviceID = $('#deviceID').val();
    console.log(`command is: ${command}`);
    const body = {
        deviceID,
        command
    };
    $.post(`${MQTT_URL}`, body).then(response => {
        console.log(response)
    }).catch(error => {
        console.error(`Error: ${error}`);
    });
});

$('#register').on('click', function () {
    const username = $('#user').val();
    const password = $('#password').val();
    const confirm = $('#confirm').val();
    if (password === confirm) {
        const body = {
            username,
            password
        };
        $.post(`${API_URL}/registration`, body).then(response => {
            location.href = '/login';
        }).catch(error => {
            $('label[for=message]').text(error);
        });

    } else {
        $('label[for=message]').text("Password doesn't match correct");
    }
});

$('#login').on('click', () => {
    const user = $('#user').val();
    const password = $('#password').val();
    $.post(`${API_URL}/authenticate`, {
        user,
        password
    }).then((response) => {
        if (response.success) {
            localStorage.setItem('user', user);
            localStorage.setItem('isAdmin', response.isAdmin);
            localStorage.setItem('isAuthenticated', true);
            location.href = '/';
        } else {
            $('#message').append(`<p class="alert alert-danger">${response}</p>`);
        }
    });
});

const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin')
    location.href = '/login';
}

$('#footer').load('footer.html');
