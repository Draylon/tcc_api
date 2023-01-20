const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    name: {type: String, required: true},
    city: {type: String, required: true},
    country: {type: String, required: true},
    description: {type: String, required: true},
    devices: [mongoose.Schema.Types.ObjectId],
    location_type: [mongoose.Schema.Types.ObjectId],
    //data: String, // não sei mais oq era kkkkkkkkk
    date: {type: Date,default: Date.now},
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

profileSchema.index({
    location: "2dsphere",
});

profileSchema.static('findByDistance', function(latitude,longitude, distance=0) {
    if(latitude+0!==latitude){
        latitude=Number(latitude);
        longitude=Number(longitude);
    }
    if(distance==0) return this.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [latitude,longitude],
                },
                distanceField: 'distance',
            }
        },
        { $limit: 20 }
        ]);
    else return this.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [latitude,longitude],
                },
                maxDistance: distance*1000,
                distanceField: 'distance',
            }
        },
        { $limit: 20 }
        ]);
});


module.exports = mongoose.model('location', profileSchema);

/**
 * Nome do local mesmo, por exemplo:
 * Mirante,
 * Centro,
 * Centreventos,
 * Univille,
 * UDESC,
 * não conheço mais nada :(
 */