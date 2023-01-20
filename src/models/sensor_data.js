const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    //ref_id: mongoose.Schema.Types.ObjectId,
    device_id: mongoose.Schema.Types.ObjectId,
    data: String,
    data_type: String,
    date: {type: Date,default: Date.now},
});

module.exports = mongoose.model('sensor_data', profileSchema);