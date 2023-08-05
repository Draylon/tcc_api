const axios = require("axios");
const requestIp = require('request-ip');


module.exports = {
    getGeocodingData: async(req,res)=>{
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);
        const ipdata = requestIp.getClientIp(req);
        const repl = await axios.get(
            "ipwho.is/"+ipdata,{
            headers: {}
        });
        var blurHashListing = [];
        repl.data.forEach(image_element => {
            blurHashListing.push(image_element.blur_hash);
        });
        console.log(blurHashListing);
        return res.status(200).send(blurHashListing);
    },

    getBlurHashes: async (req,res)=>{
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);
        //pegar o que tiver que pegar lá no unsplash
        //pegar os blurhashes
        //dropar o resto
        try{
            var famt =  req.query.tags_en.length*2 + 
                    req.query.sensor_data + 
                    req.query.within_city + 
                    req.query.nearby_cities;
            var tags_parse = req.query.tags_en.substring(1,req.query.tags_en.length-1).replaceAll(' ','').replaceAll(',',';');
            const repl = await axios.get(
                "https://api.unsplash.com/photos/random?query="+
                tags_parse+";city_landscape&count="+famt.toString()+"&orientation=landscape",{
                headers: {
                    'Accept-Version': 'v1',
                    'Authorization': 'Client-ID '+process.env.UNSPLASH_KEY
                }
            });
            var blurHashListing = [];
            repl.data.forEach(image_element => {
                blurHashListing.push(image_element.blur_hash);
            });
            console.log(blurHashListing);
            return res.status(200).send(blurHashListing);
        }catch(e){
            return res.status(400).send(e);
        }
    },

    getImg: async(req,res)=>{
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);
        //pegar o que tiver que pegar lá no unsplash
        //pegar os blurhashes
        //dropar o resto
        try{
            const repl = await axios.get(
                "https://api.unsplash.com/photos/random?query="+
                "SEARCH KEYWORD"        +";city_landscape&count="+      "AMMOUNT"    +"&orientation=landscape",{
                headers: {
                    'Accept-Version': 'v1',
                    'Authorization': 'Client-ID '+process.env.UNSPLASH_KEY
                }
            });
            console.log(repl.data);
            /* var imgLinks = [];
            repl.data.forEach(image_element => {
                blurHashListing.push(image_element.regular);
            });
            console.log(blurHashListing); */
            return res.status(200).send();
        }catch(e){
            return res.status(400).send(e);
        }
    },
    retrieveAsset: async(req,res)=>{
        //péssima idéia mandar pro client o que já deveria estar lá, vou pensar em algo melhor depois
    },
}