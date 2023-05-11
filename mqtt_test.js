
const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://test.mosquitto.org')
client.on('connect', function () {
    console.log("Connected");
    console.log(`Is client connected: ${client.connected}`);
    client.subscribe('STONKSTOPIC', function (err) {
        if (!err) {
        client.publish('STONKSTOPIC', '_')
        }else{
            console.log("fail subscribe");
        }
    })
})

client.on('message', (topic, message) => {
    console.log(topic)
    console.log(message.toString());
})
client.on("disconnect",()=>{
    console.log("Disconnected");
    //reconnect to mosquitto server
})

client.on("error",(e)=>{
    console.log("MQTT failed to connect");
    console.log(e);
})