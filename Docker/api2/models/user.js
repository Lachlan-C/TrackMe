const mongoose = require('mongoose');
module.exports = mongoose.model('User', new mongoose.Schema({
    user: String,
    password: String,
    isAdmin: Boolean
}));