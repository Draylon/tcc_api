const mongoose = require('mongoose');
let { getNewClient,getStaticClient } = require('../../mqtt')

module.exports = (topic,message)=>{
    console.log("message received:::");
    console.log(topic);
    console.log(message.toString());

    let topicRR = topic.split("/");
    topicRR.shift();
    while(topicRR.length>0){
        switch (topicRR[0]) {
            //sensor operations
            case "sensor":
                topicRR.shift();break;
                //add new sensor
                case "new_sensor":
                    console.log("adding new sensor");
                    const lm1 = message.toString().split("_");
                    const cli1 = getStaticClient();
                    cli1.publish("hyqnap5637/sensor/registered_sensor",(Number(lm1[0])).toString()+"_"+(Number(lm1[0]) + 8));
                    topicRR.shift();break;
                case "registered_sensor":
                    topicRR.shift();break;
            //data coming in
            case "data":
                topicRR.shift();break;
            case "":
                topicRR.shift();break;
            default:
                //topic??
                topicRR.shift();break;
        }

    }
    console.log("::message parsed")
}