const mongoose = require('mongoose');
const { SensorDevice } = require('../models');

const sharedQueries = require("../shared/data_retrieve");

module.exports = {

    parseUIFeed: async (req,res)=>{
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);

        /* req.query.dataFrom;
        req.query.queryFields;
        req.params.type; */
        
        var response_data = [];
        
        switch (req.params.type) {
            case "tags":{
                /*
                locations_by_tag_nearby             Local que possui a tag. Mostrar 3 primeiros, 4° botão "carregar o resto" se tiver mais. "carregar cidades proximas" se acabar.
                locationmetrics_by_tag_nearby      "Praias estão de acordo com a especificação da maioria dos dados obtidos". Essa parte é mais 'informação' do q dados.
                sensordatacloud_by_tag_nearby     "quais são os tipos de dados obtidos dessa região."
                */
                var query_fields = req.query.queryFields.split(";");
                query_fields.forEach(fn => {
                    if (fn in sharedQueries && typeof sharedQueries[fn] === "function") {
                        var result = sharedQueries[fn](req.query.dataFrom,JSON.parse(req.query.location));
                        response_data.push(result);
                        }else{
                            console.log("Compromised function call!");
                            console.log("could not find " + fn + " function");
                      }
                    
                });
                await Promise.all(response_data).then((values)=>{
                    return res.status(200).send(values);
                });
            }
            break;
            case "sensordata":{

            }
            case "withincity":{

            }
            case "nearbycities":{

            }
            default:
                res.status(400).send();
        }
    },

    getAll: async (req, res) => {
        const data = await SensorDevice.find().limit(20);
        if (data){
             return res.status(200).json(data);
        }else{
            res.status(400).send();
            return;
        }
    },
    getOne: async (req, res) => {
        const data = await SensorDevice.find({"_id":req.params.sensor_id}).limit(20);
        if (data){
            return res.status(200).json(data);
        }else{
            res.status(400).send();
            return;
        }
    },

    getByRegion: async(req,res)=>{

    },
    
    getBySensor: async(req,res)=>{
        return res.status(400).send();
    },


    createOne: async (req, res) => {
        const data = {
            name: req.body.name,
            description: req.body.description,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            data_type: req.body.data_type,
        };
        const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, data);
        const newFrag = await new SensorDevice(merged);
        return newFrag.save().then(
            res.status(201).send()
        );
    },
    
    postData: async(req,res)=>{

    },



    updateOne: async (req, res) => {
        
    },
    deleteOne: async (req, res) => {
        await SensorDevice.findByIdAndDelete(req.params.sensor_id,function(e){
            if(!e) res.status(204).send();
            else res.status(401).send();
        });
        //await SensorDevice.findOneAndRemove({_id: req.params.sensor_id},function(e){});
        // res.status(204).json({
        //     status: 'success',
        //     data: null,
        // });
    },
    
    deleteByRegion:async(req,res)=>{

    },
    deleteBySensor: async(req,res)=>{

    },
    deleteAll: async(req,res)=>{

    },
}