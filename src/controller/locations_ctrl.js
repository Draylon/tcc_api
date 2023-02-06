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
                const repl = await axios.get("http://api.positionstack.com/v1/reverse?access_key=83305497cc68ff4dbbb3a16664975d10&query="+req.params.lat+","+req.params.long+"&limit=1");
                return res.status(200).send(repl.data.data[0]);
            }catch(e){
                return res.status(400).send(e.response);
            }
        }


        //http://api.positionstack.com/v1/reverse?access_key=83305497cc68ff4dbbb3a16664975d10&query=-26.295280164458728,-48.83570063881643&limit=10
    },
    
}