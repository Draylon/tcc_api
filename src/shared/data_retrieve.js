const mongoose = require('mongoose');
const { Location,SensorDevice,LocationType, SensorData } = require('../models');

module.exports = {
    locations_by_tag_nearby: async (tag,user_loc)=>{
        console.log(user_loc);
        //Local que possui a tag. Mostrar 3 primeiros, 4° botão "carregar o resto" se tiver mais. "carregar cidades proximas" se acabar.
        
        //retrieve <limit> locations nearby <coordinates> with <tag>.
        const data = await Location.findTagByDistance(user_loc.latitude,user_loc.longitude,tag,0,3);
        return {type:"locations",data: data};
    },
    locationmetrics_by_tag_nearby: async (tag,user_loc)=>{
        //"Praias estão de acordo com a especificação da maioria dos dados obtidos". Essa parte é mais 'informação' do q dados.

        //compose metrics data?
        //compose general metrics from data of each <location> that has the <tags> ( from "enough" locations nearby )

        const data=["compose general metrics from data of each <location> that has the <tags> ( from 'enough' locations nearby )"];

        return {type:"locationmetrics",data:data};
    },
    sensordatacloud_by_tag_nearby: async (tag,user_loc)=>{
        //"quais são os tipos de dados obtidos dessa região."
        
        //retrieve which <data_type> are present within <sensor> in <location> that has <tag>
        
        // data levels by type in tag region
        const data=["retrieve which <data_type> are present within <sensor> in <location> that has <tag>"];

        return {type:"sensordatacloud",data:data};
    },
    locationtype_avaliable_nearby: async (user_loc)=>{
        var loc_tags = new Set();
        var loc_tags_array = [];
        var loc_data = await Location.findByDistance(user_loc.latitude,user_loc.longitude);
        loc_data.forEach(element => {
            element.location_type.forEach(e=>{
                loc_tags.add(e);
            })
        });
        
        loc_tags_array = Array.from(loc_tags);
        var tags_docs = await LocationType.find({
            _id: {
                $in:loc_tags_array
            }
        });
        var repl = [];
        tags_docs.forEach(doc=>{
            repl.push({
                tag:doc.type,
                tag_en:doc.type_en
            })
        })
        return repl;
    },
    sensordatatype_avaliable_nearby: async(user_loc)=>{
        var loc_unit_types=new Set();
        var sensors_nearby = await SensorDevice.findByDistance(user_loc.latitude,user_loc.longitude);
        sensors_nearby.forEach(element=>{
            element.data_type.forEach(e=>{
                loc_unit_types.add(e);
            })
        });
        if(loc_unit_types.has('No measurement units')) loc_unit_types.delete('No measurement units');
        return Array.from(loc_unit_types);
    },
    neighboring_cities_nearby: async(user_loc)=>{
        var resp = [];
        var nr_cities = await Location.aggregate([{
            $group: {
                _id: "cities_group",
                cities: {
                  $addToSet: {
                    "name":"$name",
                    "city":"$city",
                    "description": "$description",
                    "location": "$location",
                    "location_type": "$location_type"
                  }
                }
              }
        }]);
        
        nr_cities[0].cities.forEach(e=>{e.city.toLowerCase()==req.query.city.toLowerCase()?null:resp.push(e.city);})
        return resp;
    },
    realtime_index_location: async (dataType,user_loc)=>{
        //data from <datatype> near <Sensor>, 
        console.log("querying near: "+user_loc.latitude+" "+user_loc.longitude);
        var devices = await SensorDevice.findByDistance(user_loc.latitude,user_loc.longitude,1);
        var dev_ids = [];
        devices.forEach((e)=>dev_ids.push(e._id));
        console.log("devices:"+devices);
        var dataq = await SensorData.find({
            device_id: {
                $in:dev_ids
            },
            data_type: dataType
        },{
            _id:0,
            data:1,
            date:1,
        }).limit(20);
        console.log(dataq);
        return {type:"realtime_index",data:[{"sensor_data":dataq}]};
    },
    last24h_graph_location: async (dataType,user_loc)=>{
        var devices = await SensorDevice.findByDistance(user_loc.latitude,user_loc.longitude,1);
        var dev_ids = [];
        var dnow =new Date(Date.now());
        var d24he = new Date(Date.now());
        d24he.setHours(dnow.getHours()-24);
        devices.forEach((e)=>dev_ids.push(e._id));
        var dataq = await SensorData.find({
            device_id: {
                $in:dev_ids
            },
            data_type: dataType,
            date:{
                $gte:new Date(d24he.toISOString()),$lt:new Date(dnow.toISOString())
            }
        },{
            _id:0,
            data:1,
            date:1,
        });
        return {type:"last24h_graph",data:[{"sensor_data":dataq,"threshold":600}]};
    },
    comparison_yearly_monthly: async (dataType,latitude,longitude)=>{

    },
    averages_by_daterange: async (dataType,latitude,longitude)=>{

    },
    averages_by_something: async (dataType,latitude,longitude)=>{

    },

    
};