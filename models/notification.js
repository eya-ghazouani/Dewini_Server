const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    notif:{type: String, },
    date:{type: String },
})

module.exports = mongoose.model('notification', notificationSchema);