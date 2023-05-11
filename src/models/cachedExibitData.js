const mongoose = require('mongoose');
const lc_ip = require('./location_type');

const profileSchema = mongoose.Schema({
    request_identifier: {},
    parsed_data: [],
    date: {type: Date,default:Date(Date.now)},
    parsed_location: mongoose.Schema.Types.ObjectId,
});

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


module.exports = mongoose.model('cachedExibitData', profileSchema);

/**
 * Nome do local mesmo, por exemplo:
 * Mirante,
 * Centro,
 * Centreventos,
 * Univille,
 * UDESC,
 * não conheço mais nada :(
 */