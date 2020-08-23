const mqtt = require('mqtt');
const express = require('express');
const mongoose = require('mongoose');
const Device = require('./models/device');
mongoose.connect("mongodb+srv://dbUser:mF9XWR5QVePTiJWX@trackme-backend.syktl.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5001;
const randomCoordinates = require('random-coordinates');
const rand = require('random-int');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(`${__dirname}/public/generated-docs`));
app.get('/docs', (req, res) => {
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
client.on('connect', () => {
    client.subscribe('/sensorData');
    console.log('mqtt connected');
});
/**
 * @api {get} /send-command Tests to see that the mqtt broker is working by sending a command
 * @apiGroup Test Connection
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "published new message"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 *  "ERROR: No Id set"
 * }
 */
app.post('/send-command', (req, res) => {
    const {
        deviceId,
        command
    } = req.body;
    const topic = `/superrandomuniqueid/command/${deviceId}`;
    client.publish(topic, command, () => {
        res.send('published new message');
    }).catch(error => {
        $('label[for=message]').text(error);
    });
});

client.on('message', (topic, message) => {
    if (topic == '/sensorData') {
        const data = JSON.parse(message);
        console.log(data);
        Device.findOne({
            "name": data.deviceId
        }, (err, device) => {
            if (err) {
                console.log(err)
            }
            const {
                sensorData
            } = device;
            const {
                ts,
                loc,
                temp
            } = data;
            sensorData.push({
                ts,
                loc,
                temp
            });
            device.sensorData = sensorData;
            device.save(err => {
                if (err) {
                    console.log(err)
                }
            });
        });
    }
});

/**
 * @api {put} /sensor-data Adds more locatd temperature data to the users device database through mqtt
 * @apiGroup Adding Data
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "published new message"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 *  "TypeError: Cannot destructure property 'sensorData' of 'device' as it is null."
 * }
 */
app.put('/sensor-data', (req, res) => {
    const {
        deviceId
    } = req.body;
    const [lat, lon] = randomCoordinates().split(", ");
    const ts = new Date().getTime();
    const loc = {
        lat,
        lon
    };
    const temp = rand(20, 50);
    const topic = `/sensorData`;
    const message = JSON.stringify({
        deviceId,
        ts,
        loc,
        temp
    });
    client.publish(topic, message, () => {
        res.send('published new message');
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});