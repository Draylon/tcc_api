const express = require('express');
const router = express.Router();

const db = require('../db/mongo');

const {DataCtrl} = require('../controller');

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

//==============================

const v1_route = express.Router();


v1_route
    .route('/data')
    .get(cringe)
    .post(cringe)
    .delete(DataCtrl.deleteAll);

    v1_route
    .route('/data/feed/:program')
    .all(DataCtrl.parseProgramData);

    v1_route
    .route('/data/region/:lat/:long')
    .get(DataCtrl.getByRegion)
    .delete(DataCtrl.deleteByRegion);

v1_route
    .route('/data/sensor/:sensor_id')
    .get(DataCtrl.getBySensor)
    .post(DataCtrl.postData)
    .patch(DataCtrl.updateOne)
    .delete(DataCtrl.deleteBySensor);


    

//=========================================

router.use('/v1',v1_route);

module.exports = router;