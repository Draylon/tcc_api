
//https://superuser.com/questions/1131874/how-to-access-localhost-of-linux-subsystem-from-windows

const mqtt = require('mqtt')

module.exports={
    init:(message_parser)=>{
        const client  = mqtt.connect('mqtt://192.168.0.3:1883')
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