const mongoose = require('mongoose');


const profileSchema = mongoose.Schema({
    ref_id: mongoose.Schema.Types.ObjectId,
    name: {type: String,default: "Unknown Device"},
    description: {type: String,default:"no description avaliable"},
    latitude: {type: Number,default: ()=>{return (Math.random() * 0.0391552) -26.2782853;}},
    longitude: {type: Number,default: ()=>{return (Math.random() * 0.0561391) -48.8804198}},
    data_type: [String,String],
});

module.exports = mongoose.model('sensor_device', profileSchema);