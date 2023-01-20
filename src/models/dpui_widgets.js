const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    int_name: String,
    title: String,
    description: String,
    bg_image: String,
    action_code: String
});

module.exports = mongoose.model('dpui_widgets', profileSchema);
