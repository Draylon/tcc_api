const express = require('express');
const generalRouter = express.Router();

//const r1 = require("./sensor_routes");
//const r2 = require("./locations_routes");
//const r3 = require("./data_routes");
const r4 = require("./uiData_routes");

//generalRouter.use(r1);
//generalRouter.use(r2);
//generalRouter.use(r3);
generalRouter.use(r4);

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