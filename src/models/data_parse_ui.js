const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    name: String,
    view_type: String,
    widgets_pos: [Number],
    widgets_list: [mongoose.Schema.Types.ObjectId],
    viewport: String,

});

module.exports = mongoose.model('data_parse_ui', profileSchema);
