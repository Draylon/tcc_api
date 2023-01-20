const express = require('express');
const router = express.Router();

const db = require('../db/mongo');

const {Location,LocationType} = require('../controller');

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
    .route('/api/loc')
    .get(Location.get)
    .post(SensorCtrl.createOne);

router
    .route('/api/loc/type')
    .get(SensorCtrl.getOne)
    .patch(SensorCtrl.updateOne)
    .delete(SensorCtrl.deleteOne);

router
    .route('/api/data')
    .post(cringe)
    .delete(DataCtrl.deleteAll);

router
    .route('/api/data/:lat/:long')
    .get(DataCtrl.getByRegion)
    .delete(DataCtrl.deleteByRegion);

router
    .route('/api/data/:sensor_id')
    .get(DataCtrl.getBySensor)
    .post(DataCtrl.postData)
    .patch(DataCtrl.updateOne)
    .delete(DataCtrl.deleteBySensor);
    

module.exports = router;