

/**
 * 
 * https://medium.com/@rafaelbarbosadc/criando-uma-api-rest-com-node-js-express-mongoose-f75a27e8cdc1
 * 
 * https://blog.4linux.com.br/como-organizar-e-manipular-rotas-com-node-js-e-express/
 * https://expressjs.com/en/guide/routing.html
 * https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial
 */

const mongoose = require('mongoose');
const {Location,SensorDevice, LocationType} = require("../models")

module.exports = {
    get: async (req, res) => {
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);

        if(req.params.data_type == 'main_menu'){
            //Encontrar local da pessoa, via whois (e GPS?)
            //Filtrar tags de local mais próximas
            //Listar tipos de dados dos sensores mais próximos
            //Listar todas as tags na cidade
            //Filtrar as cidades mais próximas

            var rd = {
                "tags": [],
                "sensor_data": [],
                "within_city": [],
                "nearby_cities": [],
            };

            var loc_tags = new Set();
            var loc_tags_array = [];
            var loc_data = await Location.findByDistance(req.query.latitude,req.query.longitude);
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
            loc_tags = new Set();
            tags_docs.forEach(e=>{
                loc_tags.add(e.type);
            })
            
            Array.from(loc_tags).forEach(e=>{if(e!=[])rd.tags.push(e);});
            //============
            var loc_unit_types=new Set();
            var sensors_nearby = await SensorDevice.findByDistance(req.query.latitude,req.query.longitude);
            sensors_nearby.forEach(element=>{
                element.data_type.forEach(e=>{
                    loc_unit_types.add(e);
                })
            });
            if(loc_unit_types.has('No measurement units')) loc_unit_types.delete('No measurement units');
            Array.from(loc_unit_types).forEach(e=>{if(e!=[])rd.sensor_data.push(e)});

            //=====================================
            var withincity = await Location.find({city: {$regex: req.query.city,$options: 'i'}});
            withincity.forEach(local_da_cidade=>{
                rd.within_city.push(local_da_cidade.name);
            })
            
            //Colocar tags de todos os dispositivos na cidade
            /* console.log(withincity);
            var dev_list=[];
            withincity.devices.forEach(e=>{dev_list.push(e._id)});
            var dev_list2 = SensorDevice.find({
                _id: {
                    $in:dev_list
                }
            });
            (await dev_list2).forEach(device=>{
                device.data_type.forEach(type_=>{
                    rd.within_city.push(type_);
                })
            }); */

            //=========================================
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
            nr_cities[0].cities.forEach(e=>{e.city.toLowerCase()==req.query.city.toLowerCase()?null:rd.nearby_cities.push(e.city);})


            return res.status(200).json(rd);
        }else{
            //http://api.positionstack.com/v1/reverse?access_key=83305497cc68ff4dbbb3a16664975d10&query=-26.295280164458728,-48.83570063881643&limit=10
    
            return res.status(200).send();

            const data = await SensorData.find({device_id:req.query.data_type},length=10);
            if (data){
                return res.status(200).json(data);
            }else{
                res.status(400).send();
                return;
            }
        }
    },
    create: async (req, res) => {
        const data = {
            data_type: req.body.data_type
        };
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);
        const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, data);
        const newFrag = await new SensorData(merged);
        return newFrag.save().then(
            res.status(200)
            );
    },
    update: async (req, res) => {
        
    },
    delete: async (req, res) => {
        res.status(204).json({
            status: 'success',
            data: null,
        });
    }
}