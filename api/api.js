const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dbUser:mF9XWR5QVePTiJWX@trackme-backend.syktl.mongodb.net', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const express = require('express');
const app = express();
const port = 5000;
const Device = require('./models/devices');
app.get('/api/test', (req, res) => {
    res.send('The API is working!');
    2 / 13
});
app.get('/api/devices', (req, res) => {
    Device.find({}, (err, devices) => {
        return err ? res.send(err) : res.send(devices);
    });
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
