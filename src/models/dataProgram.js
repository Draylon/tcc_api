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

/**
 * 
 * [
  {
    data: [
      [0, 59.864000000000004, 100]
    ], 
    passthrough: {
      _id: 64ab5abe3439b03dd10ded19, 
      dataset_interval: last1h, 
      dataset_data_type: [all_related_tags, traffic_info, crowd_info], 
      data_display: radial, 
      data_parsing_functions: [tags_are_level_percentage], 
      data_type: epoch_data, 
      static_input_data: {
        title: Porcentagens na última hora
      }
    }
  }, 
  {
    data: [[
      {data: 456.29, date: 2023-05-06T17:15:00.000Z}, 
      {data: 440.87, date: 2023-05-06T17:45:00.000Z}, 
      {data: 404.78, date: 2023-05-06T18:15:00.000Z}, 
      {data: 422.33, date: 2023-05-06T18:45:00.000Z}, 
      {data: 459.63, date: 2023-05-06T19:15:00.000Z}, 
      {data: 396.72, date: 2023-05-06T19:45:00.000Z}, 
      {data: 424.91, date: 2023-05-06T20:15:00.000Z}, 
      {data: 394.16, date: 2023-05-06T20:45:00.000Z}, 
      {data: 445.24, date: 2023-05-06T21:15:00.000Z}, 
      {data: 453.97, date: 2023-05-06T21:45:00.000Z}, 
      {data: 463.65, date: 2023-05-06T22:15:00.000Z}, 
      {data: 411.94, date: 2023-05-06T22:45:00.000Z}, 
      {data: 457.08, date: 2023-05-06T23:15:00.000Z}, 
      {data: 403.12, date: 2023-05-06T23:45:00.000Z}, 
    ]]
  }
]
 */


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