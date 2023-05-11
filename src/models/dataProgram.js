const mongoose = require('mongoose');
const lc_ip = require('./location_type');

const profileSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    //presenting name
    
    detailed: {type: String, required: true},
    // text inside card

    tags: [String],
    // what types of data are included in this program
    
    exibits: [{String:String}]
});

profileSchema.static('query_by_tags', function(tags) {
    
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

module.exports = mongoose.model('programData', profileSchema);

/*

{
    "_id": {
        "$oid": "644895fc515eac9ebfa6a6ca"
    },
    "name": "Air quality index",
    "description": "Check on Air quality nearby",
    //presenting name
    
    "detailed": "Application centered on compiling information into simple graphs",
    // text inside card

    "tags": "o3;co2;co;dust;so2;no2",
    // what types of data are included in this program
    
    "exibits": [
      {
        "dataset_interval":"last1h",//last24h, last1h, last30m, last15min, realtime
        "dataset_data_type":"all_related_tags;traffic_info;crowd_info",//all tags, single tag:tag, specific data:data
        "data_display":"radial" // graph / radial
        "data_parsing_functions":[
            "tags_are_level_percentage"
         ]
      },{
        "dataset_interval":"last24h",//last24h, last1h, last30m, last15min, realtime
        "dataset_data_type":"all_related_tags",//all tags, single tag:tag, specific data:data
        "data_display":"radial" // graph / radial
        "data_parsing_functions":[
            "show_min_max_level_tag"          
         ]
      },
    ]
}

*/


/**
 * Nome do local mesmo, por exemplo:
 * Mirante,
 * Centro,
 * Centreventos,
 * Univille,
 * UDESC,
 * não conheço mais nada :(
 */