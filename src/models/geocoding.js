const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    name: String,
    view_type: String,
    widgets_pos: [Number],
    widgets_list: [mongoose.Schema.Types.ObjectId],

});

module.exports = mongoose.model('geocoding', profileSchema);
