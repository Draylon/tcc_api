const express = require('express');
const router = express.Router();

const db = require('../db/mongo');

const {SensorCtrl} = require('../controller');

cringe = (req,res) =>{
    const rquery = req.query;
    const rparams = req.params;
    const rbody = req.body;
    console.log(rparams);
    console.log(rquery);
    console.log(rbody);
    console.log();
    return res.status(204).send();
};

router
    .route('/api/sensor')
    .get(SensorCtrl.getAll)
    .post(SensorCtrl.createOne);

router
    .route('/api/sensor/:sensor_id')
    .get(SensorCtrl.getOne)
    .patch(SensorCtrl.updateOne)
    .delete(SensorCtrl.deleteOne);
    

module.exports = router;