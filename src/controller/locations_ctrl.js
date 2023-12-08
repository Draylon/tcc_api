const axios = require("axios");

 const mongoose = require('mongoose');

 module.exports = {
    get: async (req, res) => {
        
    },
    getByRegion: async(req,res)=>{
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);
        
        if(req.params.lat!=""&&req.params.long!=""){
            try{
                const repl = await axios.get("http://api.positionstack.com/v1/reverse?access_key="+process.env.POSITIONSTACK+"&query="+req.params.lat+","+req.params.long+"&limit=1");
                return res.status(200).send(repl.data.data[0]);
            }catch(e){
                return res.status(400).send(e.response);
            }
        }


        //http://api.positionstack.com/v1/reverse?access_key=lmao&query=-26.295280164458728,-48.83570063881643&limit=10
    },
    getByInput: async(req,res)=>{
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);
        console.log("===========");
        
        if(req.query.search_topic!=""){
            try{
                const repl = await axios.get("http://api.positionstack.com/v1/forward?access_key="+process.env.POSITIONSTACK+"&query="+req.query.search_topic+"&country=BR&limit=10");
                return res.status(repl.status).send(repl.data.data);
            }catch(e){
                console.log(e);
                return res.status(e.status).send(e.statusText);
            }
        }else{
            return res.status(400).send("");
        }
    }
    
}