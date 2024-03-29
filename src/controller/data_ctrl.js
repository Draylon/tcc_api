const mongoose = require('mongoose');
const { SensorDevice, ProgramData, DataParsingUI } = require('../models');

const sharedQueries = require("../shared/data_retrieve");

module.exports = {

    parseProgramData: async (req,res)=>{
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);

        /* req.query.dataFrom;
        req.query.queryFields;
        req.params.type; */
        
        var response_data = [];
        var progData = await ProgramData.findById(mongoose.Types.ObjectId(req.params.program),{_id:0});
        console.log("\nProgram data:");
        console.log(progData);


        progData.exibits.forEach((exibit) => {
            exibit = JSON.parse(JSON.stringify(exibit));
            if (exibit.data_type in sharedQueries && typeof sharedQueries[exibit.data_type] === "function"){

                //var from_time = new Date(Date.now());
                var from_time = new Date(Date.parse("2023-05-07T16:57:00.000+00:00"));

                var until_time = new Date(from_time.valueOf());
                switch(exibit.dataset_interval){
                    case "last1h":
                    case "last1h_relative":
                        until_time.setHours(until_time.getHours()-1);
                        break;
                    case "last24h":
                    case "last24h_relative":
                        until_time.setHours(until_time.getHours()-24);
                        break;
                    default:
                }
                
                response_data.push(sharedQueries[exibit.data_type](
                    JSON.parse(req.query.location),
                    until_time,
                    from_time,
                    progData.tags,
                    exibit
                    ));
            }else{
                console.log("Compromised function call!");
                console.log("could not find " + exibit.data_type + " function");
            }

        });
        var ret = [];
        await Promise.all(response_data).then((values)=>{
            ret=values;
        });
        return res.status(200).send(ret);

        return res.status(400).send();
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
                //realtime_index_location;last24h_graph_location;comparison_yearly_monthly;averages_by_daterange;averages_by
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