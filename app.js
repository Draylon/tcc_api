const express = require('express');
const mongo = require('./src/db/mongo');
const router = require("./src/routes");

const https = require("https");
const fs = require("fs");
const helmet = require("helmet");

//===========================

const mqtt_en = require("./mqtt")
const mqtt_msg_parser = require("./src/shared/mqtt_message_parser")

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(helmet());

app.use(router);


//========

mongo.init();

if(process.env.NODE_ENV == "development"){
    fs.access("./ssl/key.pem", fs.F_OK, (err) => {
    if (err) {
        console.log(err);return;
    }
    try {
        const options = {
            key: fs.readFileSync("./ssl/key.pem"),
            cert: fs.readFileSync("./ssl/cert.pem"),
            dhparam: fs.readFileSync("./ssl/dh.pem")
        };

        app.listen(8081, () => {
            console.log("app is listening successfully");
        })

        https.createServer(options, app).listen(8080,()=>{
            console.log("Started https");
        });

        //mqtt_en.init(mqtt_msg_parser);

    } catch (error) {
        console.log(error);
    }
    });
}

if(process.env.NODE_ENV == "production"){
    app.listen(8080, () => {
        console.log("app is listening successfully");
    })

    //mqtt_en.init(mqtt_msg_parser);
}




//https://documentation.commvault.com/v11/essential/45578_rest_api_authentication_post_login.html

//https://web.dev/i18n/pt/how-to-use-local-https/
//https://stackoverflow.com/questions/73761771/how-to-correctly-setup-tls-ssl-on-localhost-using-http-server
//https://stackoverflow.com/questions/11804202/how-do-i-setup-a-ssl-certificate-for-an-express-js-server
//https://www.sitepoint.com/how-to-use-ssltls-with-node-js/
//https://expressjs.com/en/api.html

//https://www.npmjs.com/package/http-server

// app.use((req, res) => {
//   res.writeHead(200);
//   res.end("hello world\n");
// });

// app.listen(8000);
