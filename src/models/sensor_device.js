const mongoose = require('mongoose');


const profileSchema = mongoose.Schema({
    short_id: {type:String,default:""},
    name: {type: String,default: "Unknown Device"},
    description: {type: String,default:"no description avaliable"},
    data_type: {
        type: [String],
        default: ["No measurement units"]
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            default: [
                ()=>{return (Math.random() * 0.0391552) -26.2782853},
                ()=>{return (Math.random() * 0.0561391) -48.8804198},
            ],
            required: true
        }
    },
});

profileSchema.index({
    location: "2dsphere",
});

profileSchema.static('findByDistance', function(latitude, longitude, distance=0,limit_=20) {
    if(latitude+0!==latitude){
        latitude=Number(latitude);
        longitude=Number(longitude);
    }
    if(distance==0) return this.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [latitude, longitude]
                    },
                    distanceField: 'distance'
                }
            },
            { $limit: limit_ }
        ]);
    else return this.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [latitude, longitude]
                },
                maxDistance: distance * 1000,
                distanceField: 'distance'
            }
        },
        { $limit: limit_ }
    ]);
});

module.exports = mongoose.model('sensor_device', profileSchema);