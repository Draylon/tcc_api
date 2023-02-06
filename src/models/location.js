const mongoose = require('mongoose');
const lc_ip = require('./location_type');

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

profileSchema.static('findByDistance', function(latitude,longitude, distance=0,limit_=20) {
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
        { $limit: limit_ }
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
        {$limit: limit_}
        ]);
});

profileSchema.static('findTagByDistance', async function(latitude,longitude,tag,distance=0,limit_=20){
    if(latitude+0!==latitude){
        latitude=Number(latitude);
        longitude=Number(longitude);
    }
    const loctp = await lc_ip.findOne({type_en:tag});

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
        {
            $match:{
                location_type:loctp._id
            }
        },
        {
            $lookup:{
                from: 'location_types',
                localField: 'location_type',
                foreignField: '_id',
                as: 'location_type'
              }
        },
        {
            $lookup:{
                from: 'sensor_devices',
                localField: 'devices',
                foreignField: '_id',
                as: 'devices'
              }
        },
        {
            $project:{
                _id:0,
                name:1,
                city:1,
                country:1,
                description:1,
                "devices.data_type":1,
                "location_type.type":1,
                date:1,
                location:1,
                distance:1
              }
        },
        { $limit: limit_ }
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
        {
            $match:{
                location_type:loctp._id
            }
        },{
            $lookup:{
                from: 'location_types',
                localField: 'location_type',
                foreignField: '_id',
                as: 'location_type'
              }
        },
        {
            $lookup:{
                from: 'sensor_devices',
                localField: 'devices',
                foreignField: '_id',
                as: 'devices'
              }
        },
        {
            $project:{
                _id:0,
                name:1,
                city:1,
                country:1,
                description:1,
                devices:1,
                "location_type.type":1,
                date:1,
                location:1,
                distance:1
              }
        },
        {$limit: limit_}
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