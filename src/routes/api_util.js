const express = require('express');
const router = express.Router();

const {Utils} = require("../controller")

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
    .route("/api/util/blurhashes")
    .get(Utils.getBlurHashes);

v1_route
    .route("/api/util/retrieve_asset")
    .get(Utils.retrieveAsset);

v1_route
    .route("/api/util/img_lookup")
    .get(Utils.getImg);

//=================================

router.use('/v1',v1_route);

module.exports = router;