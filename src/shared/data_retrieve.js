const mongoose = require('mongoose');
const { Location,SensorDevice,LocationType, SensorData, ProgramData} = require('../models');

module.exports = {
    programs_available_by_tag : async(tags_)=>{
        return await ProgramData.find({tags: { $in:tags_}});
    },
    programs_available_nearest : async(user_loc,lim)=>{
        const data = await ProgramData.query_nearby_tags(user_loc.latitude,user_loc.longitude,tag,0,3);
        return data;
    },

    sensordatatype_avaliable_nearby: async(user_loc)=>{
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
    locationtype_avaliable_nearby: async (user_loc)=>{
        var loc_tags = new Set();
        var loc_tags_array = [];
        var loc_data = await Location.findByDistance(user_loc.latitude,user_loc.longitude);
        loc_data.forEach(element => {
            element.location_type.forEach(e=>{
                loc_tags.add(e);
            })
        });
        
        loc_tags_array = Array.from(loc_tags);
        var tags_docs = await LocationType.find({
            _id: {
                $in:loc_tags_array
            }
        });
        var repl = [];
        tags_docs.forEach(doc=>{
            repl.push({
                tag:doc.type,
                tag_en:doc.type_en
            })
        })
        return repl;
    },
    sensordatatype_avaliable_nearby: async(user_loc,distance=0)=>{
        var loc_unit_types=new Set();
        var sensors_nearby = await SensorDevice.findByDistance(user_loc.latitude,user_loc.longitude,distance);
        sensors_nearby.forEach(element=>{
            element.data_type.forEach(e=>{
                loc_unit_types.add(e);
            })
        });
        if(loc_unit_types.has('No measurement units')) loc_unit_types.delete('No measurement units');
        return Array.from(loc_unit_types);
    },
    neighboring_cities_nearby: async(user_loc)=>{
        var resp = [];
        var nr_cities = await Location.aggregate([{
            $group: {
                _id: "cities_group",
                cities: {
                  $addToSet: {
                    "name":"$name",
                    "city":"$city",
                    "description": "$description",
                    "location": "$location",
                    "location_type": "$location_type"
                  }
                }
              }
        }]);
        
        nr_cities[0].cities.forEach(e=>{e.city.toLowerCase()==req.query.city.toLowerCase()?null:resp.push(e.city);})
        return resp;
    },
    realtime_index_location: async (dataType,user_loc)=>{
        //data from <datatype> near <Sensor>, 
        console.log("querying near: "+user_loc.latitude+" "+user_loc.longitude);
        var devices = await SensorDevice.findByDistance(user_loc.latitude,user_loc.longitude,1);
        var dev_ids = [];
        devices.forEach((e)=>dev_ids.push(e._id));
        console.log("devices:"+devices);
        var dataq = await SensorData.find({
            device_id: {
                $in:dev_ids
            },
            data_type: dataType
        },{
            _id:0,
            data:1,
            date:1,
        }).limit(20);
        console.log(dataq);
        return {type:"realtime_index",data:[{"sensor_data":dataq}]};
    },

    ui_button: async(user_loc,until,from,sensor_data_tags,exibit) =>{
        
        console.log({"data":null,"passthrough":exibit});
        return {"data":null,"passthrough":exibit};

    },
    epoch_data: async(user_loc,until,from,sensor_data_tags,exibit) =>{
        //limit by region
        var devices = await SensorDevice.findByDistance(user_loc.latitude,user_loc.longitude,15);
        var dev_ids = [];
        devices.forEach((e)=>dev_ids.push(e._id));
        
        var response_data = [];
        console.log(exibit);

        exibit.dataset_data_type.forEach(dtype => {
            switch (dtype) {
                case "all_related_tags":
                    response_data.push(new Promise( async (res,rej)=> {
                        var raw_data = await SensorData.find({
                                device_id: {
                                    $in:dev_ids
                                },
                                data_type: {
                                    $in: sensor_data_tags
                                },
                                date:{
                                    $gte:new Date(until.toISOString()),$lt:new Date(from.toISOString())
                                }
                            },{
                                _id:0,
                                data:1,
                                date:1,
                            }
                        );
                        var parsed_data = [];
                        exibit.data_parsing_functions.forEach(parse_method =>{
                            switch(parse_method){
                                case "tags_are_level_percentage":
                                    // QUERY METHOD FOR SPECIFIC DATA TYPE!!!!!!!!!!!!
                                    raw_data.forEach(data_obj=>{
                                        console.log(data_obj);
                                        var v1 = (data_obj.data - 400);
                                        if(v1<0) v1*=-1;
                                        if(v1<50) parsed_data.push(100);
                                        else parsed_data.push(100 - (v1*100/250));
                                    });
                                    avg = 0;
                                    parsed_data.forEach(v=>{avg+=v;});
                                    avg/=parsed_data.length;
                                    parsed_data=[0,avg,100];
                                    break;
                                default:
                                    parsed_data = raw_data;
                            }
                        });
                        res(parsed_data);
                    }
                    ));
                    break;
                case "traffic_info":
                    //query traffic data?
                    break;
                case "crowd_info":
                    //query users cache location :)
                    break;
                default:
                    break;
            }
        });
        var ret;
        await Promise.all(response_data).then((values)=>{
            console.log(values);
            ret={"data":values,"passthrough":exibit};
        });
        return ret;
        ///console.log({type:"epoch_data",data:[{"sensor_data":dataq,"threshold":600}]});
        //return {type:"epoch_data",data:[{"sensor_data":dataq,"threshold":600}]};
    },
    last24h_graph_location: async (dataType,user_loc)=>{
        var devices = await SensorDevice.findByDistance(user_loc.latitude,user_loc.longitude,1);
        var dev_ids = [];
        var dnow =new Date(Date.now());
        var d24he = new Date(Date.now());
        d24he.setHours(dnow.getHours()-24);
        devices.forEach((e)=>dev_ids.push(e._id));
        var dataq = await SensorData.find({
            device_id: {
                $in:dev_ids
            },
            data_type: dataType,
            date:{
                $gte:new Date(d24he.toISOString()),$lt:new Date(dnow.toISOString())
            }
        },{
            _id:0,
            data:1,
            date:1,
        });
        return {type:"last24h_graph",data:[{"sensor_data":dataq,"threshold":600}]};
    },
    comparison_yearly_monthly: async (dataType,latitude,longitude)=>{

    },
    averages_by_daterange: async (dataType,latitude,longitude)=>{

    },

    webapp_header_data: async (interestName)=>{
        //return ["<Container className='py-lg-md d-flex'><div className='col px-0'><Row><Col lg='9'><h1 className='display-3 text-white' style={{textAlign: 'justify',borderBottom:'2.5px white solid'}}>Qualidade do ar em</h1><h3 className='display-6 text-white' style={{textAlign: 'end'}}><span>{'Joinville'}</span></h3><p className='lead text-white'>Consulte informação sobre poluentes presentes no ar em {'joinville'}.Informe-se sobre as condições de locais em {'joinville'} comumente visitados.</p><div className='btn-wrapper'><ButtonclassName='btn-icon mb-3 mb-sm-0'color='info'href='#'><span className='btn-inner--icon mr-1'><i className='fa fa-code' /></span><span className='btn-inner--text'>Mapa aqui</span></Button><ButtonclassName='btn-white btn-icon mb-3 mb-sm-0 ml-1'color='default'href='#'><span className='btn-inner--icon mr-1'><i className='ni ni-cloud-download-95' /></span><span className='btn-inner--text'>Saiba mais</span></Button></div></Col></Row></div></Container>"];
        //return ["<div className='col px-0'><Row><Col lg='9'><h1 className='display-3 text-white' style={{textAlign: 'justify',borderBottom:'2.5px white solid'}}>Qualidade do ar em</h1><h3 className='display-6 text-white' style={{textAlign: 'end'}}><span>{'Joinville'}</span></h3><p className='lead text-white'>Consulte informação sobre poluentes presentes no ar em {'joinville'}.Informe-se sobre as condições de locais em {'joinville'} comumente visitados.</p><div className='btn-wrapper'><ButtonclassName='btn-icon mb-3 mb-sm-0'color='info'href='#'><span className='btn-inner--icon mr-1'><i className='fa fa-code' /></span><span className='btn-inner--text'>Mapa aqui</span></Button><ButtonclassName='btn-white btn-icon mb-3 mb-sm-0 ml-1'color='default'href='#'><span className='btn-inner--icon mr-1'><i className='ni ni-cloud-download-95' /></span><span className='btn-inner--text'>Saiba mais</span></Button></div></Col></Row></div>"];
        return [{
            titleUpper: "Qualidade do ar em",
            titleLower: interestName,
            description: [
                "Consulte informação sobre poluentes presentes no ar em "+interestName+".",
                "Informe-se sobre as condições de locais em "+interestName+" comumente visitados."],
            actions: [
                {
                    type: "bt1",
                    txt: "Mapa aqui",
                    action: "#"
                },
                {
                    type: "bt2",
                    txt: "Saiba mais",
                }
            ],
            src_img: "",
        }];
    },

    webapp_section_data: async (cityName,lat,lng)=>{
        var l1 = ["Mirante","Pórtico","Finder","UDESC","Eixo Industrial"];
        var l2 = ["Jardim Botânico","Ópera de Arame","Mercado Municipal","Parque Barigui","Museu Oscar Niemeyer","Memorial Polonês","Bosque do Alemão","Parque Vista Alegre"]
        var lst=[];
        if(cityName == "Curitiba"){
            l2.map(x=>{
                lst.push({
                    name: x,
                    ref: "/api/v1/ui_data/webapp_exibit/queryLocale?ref="+x+"&base=data",
                    thumb: "#"
                })
            })
        }else{
            l1.map(x=>{
                lst.push({
                    name: x,
                    ref: "/api/v1/ui_data/webapp_exibit/queryLocale?ref="+x+"&base=data",
                    thumb: "#"
                })
            })
        }
        return [
            {
                objectiveTitle: "Locais mais visitados em "+cityName,
                carouselItems: lst,
            },
            {
                objectiveTitle: "Near you",
                carouselItems: lst.slice(0,2),
            },
            {
                objectiveTitle: "Problemas recentemente reportados",
                carouselItems: [
                    //await public_notifications(localeData,4),
                    {
                        name: "Alto índice de CO2",
                        ref: "/api/v1/ui_data/webapp_exibit/queryIssues?ref=EixoIndustrial&base=data",
                        thumb: "#"
                    },
                ],
            },
        ];
    },
};