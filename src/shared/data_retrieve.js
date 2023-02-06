const mongoose = require('mongoose');
const { Location } = require('../models');

module.exports = {
    locations_by_tag_nearby: async (tag,user_loc)=>{
        console.log(user_loc);
        //Local que possui a tag. Mostrar 3 primeiros, 4° botão "carregar o resto" se tiver mais. "carregar cidades proximas" se acabar.
        
        //retrieve <limit> locations nearby <coordinates> with <tag>.
        const data = await Location.findTagByDistance(user_loc.latitude,user_loc.longitude,tag,0,3);
        return {type:"locations",data: data};
    },
    locationmetrics_by_tag_nearby: async (tag,user_loc)=>{
        //"Praias estão de acordo com a especificação da maioria dos dados obtidos". Essa parte é mais 'informação' do q dados.

        //compose metrics data?
        //compose general metrics from data of each <location> that has the <tags> ( from "enough" locations nearby )

        const data=["compose general metrics from data of each <location> that has the <tags> ( from 'enough' locations nearby )"];

        return {type:"locationmetrics",data:data};
    },
    sensordatacloud_by_tag_nearby: async (tag,user_loc)=>{
        //"quais são os tipos de dados obtidos dessa região."
        
        //retrieve which <data_type> are present within <sensor> in <location> that has <tag>
        
        // data levels by type in tag region
        const data=["retrieve which <data_type> are present within <sensor> in <location> that has <tag>"];

        return {type:"sensordatacloud",data:data};
    },
};