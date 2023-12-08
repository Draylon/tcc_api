const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const multer = require('multer')

const db = require('../db/mongo');

const {LoginCtrl} = require('../controller');

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

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var multipartParser = multer();

//==============================

const v1_route = express.Router();

v1_route
    .route('/auth')
    .get(cringe)
    .post(multipartParser.any(),LoginCtrl.auth);

v1_route
    .route('/signup')
    .get(cringe)
    .post(multipartParser.any(),LoginCtrl.signup);

v1_route
    .route('/protected')
    .get(LoginCtrl.verifyJWT,LoginCtrl.exibitUser);
//===================================

router.use('/v1',v1_route);

module.exports = router;