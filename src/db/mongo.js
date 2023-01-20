const mongoose = require('mongoose');

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            autoIndex: false,
            //reconnectTries: Number.MAX_VALUE,
            //reconnectInterval: 500,
            //poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        };

        if(process.env.NODE_ENV == "production"){
            mongoose.connect('mongodb+srv://'+process.env.MONGODB_USERNAME+':'+process.env.MONGODB_PW+'@'+process.env.MONGODB_CLOUD_ADDR,dbOptions);
        }
        if(process.env.NODE_ENV == "development"){
            mongoose.connect('mongodb://192.168.3.130:27017/trab_db', {useNewUrlParser: true});
        }
        ////mongoose.connect('mongodb+srv://admin:'+process.env.MONGO_PW+'@cluster0.w3ynl.mongodb.net/DogeBot_SQL?retryWrites=true&w=majority', dbOptions);
        
        //mongoose.set('useFindAndModify', false);
        //mongoose.Promise = global.Promise;
        
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connection successfully opened!');
        });
        
        mongoose.connection.on('err', err => {
            console.error(`Mongoose connection error: \n ${err.stack}`);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose connection disconnected');
        });
    },
};