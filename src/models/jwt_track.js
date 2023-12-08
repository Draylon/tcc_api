const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    hash: String,
    timestamp: {type: Date,default:Date(Date.now)},
    action: String,
});

module.exports = mongoose.model('jwt_track', profileSchema);