const express = require('express');
const generalRouter = express.Router();

const module_list = [
    require("./sensor_routes"),
    require("./locations_routes"),
    require("./data_routes"),
    require("./uiData_routes"),
    require("./api_util"),
    require("./login_routes"),
];

module_list.forEach((e)=>generalRouter.use(e));

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

generalRouter.route("/").all(cringe);
generalRouter.route("/cringe").all(cringe);

//======================================================


const forwardedRouter = express.Router();
forwardedRouter.route("/").get(async (req, res) => {
    return res.status(200).send(":)");
}
);

forwardedRouter.use("/api",generalRouter);
module.exports = forwardedRouter;