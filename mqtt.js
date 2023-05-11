
//https://superuser.com/questions/1131874/how-to-access-localhost-of-linux-subsystem-from-windows

const mqtt = require('mqtt')

module.exports={
    debug:(message_parser)=>{
        console.log("MQTT DEBUG MODE");
        const client  = mqtt.connect('mqtt://192.168.0.3:1883',{
            username:"rcv_1",
            password:"mqttreceiver1"
        })
        client.on('connect', function () {
        client.subscribe('sensor_data', function (err) {
            if (!err) {
            client.publish('connected_device', '_')
            }
        })
        })

        client.on('message', (topic, message) => message_parser)
        client.on("disconnect",()=>{
            //reconnect to mosquitto server
        })

        client.on("error",(e)=>{
            console.log("MQTT failed to connect");
            console.log(e);
        })
    },
    init:(message_parser)=>{
        console.log("MQTT PRODUCTION MODE");
        const client  = mqtt.connect('mqtt://test.mosquitto.org:1883')
        client.on('connect', function () {
        client.subscribe('sensor_data', function (err) {
            if (!err) {
            client.publish('connected_device', '_')
            }
        })
        })

        client.on('message', (topic, message) => message_parser)
        client.on("disconnect",()=>{
            //reconnect to mosquitto server
        })

        client.on("error",(e)=>{
            console.log("MQTT failed to connect");
            console.log(e);
        })
    }
}