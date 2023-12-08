const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    ref_id: mongoose.Schema.Types.ObjectId,
    user_id: String,
    hash: String,
});

module.exports = mongoose.model('user_auth', profileSchema);