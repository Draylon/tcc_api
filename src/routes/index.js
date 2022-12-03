const express = require('express');
const generalRouter = express.Router();

const data1 = require("./sensor_routes");

generalRouter.use(data1);

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

generalRouter.route("/api").all(cringe);

generalRouter.route("/test").all(cringe);

generalRouter.route("/").get(async (req, res) => {
        return res.status(200).send(":)");
    }
);


module.exports = generalRouter;