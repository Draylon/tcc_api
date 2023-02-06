const express = require('express');
const router = express.Router();

const db = require('../db/mongo');

const {UIDataCtrl} = require('../controller');

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

//================================

const v1_route = express.Router();

v1_route
    .route('/ui_data/:data_type')
    .get(UIDataCtrl.get)
    .post(UIDataCtrl.create)
    .patch(UIDataCtrl.update)
    .delete(UIDataCtrl.delete);
    

//=====================================

router.use('/v1',v1_route);

module.exports = router;