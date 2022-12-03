

/**
 * 
 * https://medium.com/@rafaelbarbosadc/criando-uma-api-rest-com-node-js-express-mongoose-f75a27e8cdc1
 * 
 * https://blog.4linux.com.br/como-organizar-e-manipular-rotas-com-node-js-e-express/
 * https://expressjs.com/en/guide/routing.html
 * https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial
 */

 const mongoose = require('mongoose');
 const { SensorData } = require('../models');
 
 module.exports = {
     getBySensor: async (req, res) => {
        const data = await SensorData.find({device_id:req.query.sensor_id},length=10);
        if (data){
            return res.status(200).json(data);
        }else{
            res.status(400).send();
            return;
        }
    },
    getByRegion: async (req, res) => {
         
    },
    postData: async (req, res) => {
        const data = {
            name: req.body.name
        };
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);
        const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, data);
        const newFrag = await new SensorData(merged);
        return newFrag.save().then(
            res.status(200)
            );
    },
    updateOne: async (req, res) => {
        
    },
    deleteOne: async (req, res) => {
        res.status(204).json({
            status: 'success',
            data: null,
        });
    },
    deleteAll: async(req,res)=>{

    },
    deleteBySensor: async(req,res)=>{

    },
    deleteByRegion: async(req,res)=>{

    },
}