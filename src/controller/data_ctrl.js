const mongoose = require('mongoose');
const { SensorDevice } = require('../models');

module.exports = {
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
}