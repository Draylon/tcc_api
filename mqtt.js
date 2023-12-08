
//https://superuser.com/questions/1131874/how-to-access-localhost-of-linux-subsystem-from-windows

const mqtt = require('mqtt')
let mqttClient=null;
module.exports={
    getStaticClient: ()=>mqttClient,
    debug:(message_parser)=>{
        console.log("MQTT DEBUG MODE");
        /* const client  = mqtt.connect('mqtt://192.168.0.4:1883',{
            username:"rcv_1",
            password:"mqttreceiver1"
        }) */
        const client = mqtt.connect('mqtt://test.mosquitto.org:1883');
        mqttClient=client;
        client.on('connect', function () {
            console.log("connected on debug mqtt");
            client.subscribe('hyqnap5637/#', function (err) {
                if (!err) {
                client.publish('hyqnap5637/api_status', 'api_online')
                }
            })
        })

        client.on('message', (topic, message) => message_parser(topic,message))
        client.on("disconnect",()=>{
            //reconnect to mosquitto server
        })

        client.on("error",(e)=>{
            console.log("MQTT failed to connect");
            console.log(e);
        })
    },
    getNewClient: ()=>{
        if(process.env.NODE_ENV == "production"){
            const client  = mqtt.connect('mqtt://192.168.0.4:1883',{
                username:"rcv_1",
                password:"mqttreceiver1"
            });
            return client;
        }else if(process.env.NODE_ENV == "development"){
            const client  = mqtt.connect('mqtt://test.mosquitto.org:1883');
            return client;
        }else{
            console.log("node_env??");
            return null;
        }
    },
    init:(message_parser)=>{
        console.log("MQTT PRODUCTION MODE");
        const client  = mqtt.connect('mqtt://test.mosquitto.org:1883')
        mqttClient=client;
        client.on('connect', function () {
            client.subscribe('hyqnap5637/#', function (err) {
                if (!err) {
                client.publish('hyqnap5637/api_status', 'online')
                }
            })
        })

        client.on('message', (topic, message) => message_parser(topic,message))
        client.on("disconnect",()=>{
            //reconnect to mosquitto server
        })

        client.on("error",(e)=>{
            console.log("MQTT failed to connect");
            console.log(e);
        })
    }
}