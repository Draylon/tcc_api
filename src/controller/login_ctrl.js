const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
const {UserAuth} = require("../models")
const sharedRetrieve = require("../shared/data_retrieve")

const bcrypt = require("bcrypt");
const saltRounds = 14;

//=======================


module.exports = {
    auth: async(req,res)=>{
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);
        const userName = req.body.un;
        const userPassword = req.body.pw;
        let storedHash = await UserAuth.find({user_id:userName}).limit(1);
        if(storedHash.length <= 0) return res.status(401).json({auth: false,msg: "incorrect"});
        
        bcrypt.compare(userPassword, storedHash[0].hash, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(401).json({auth: false,msg: "error"});
            } else {
                if (result) {
                    console.log(userName + ' logged in');
                    
                    const payload = {
                        sub: storedHash[0]._id,
                        name: userName,
                        exp: Math.floor(Date.now() / 1000) + 5,//+ 1800,// + 3600, // Token expires in 1 hour
                    };

                    const accessToken = jwt.sign(payload, process.env.JWT_KEY);
                    return res.status(200).json({auth: true,msg: "logged in",accessToken: accessToken});
                } else {
                    console.log('Password incorrect for '+userName);
                    return res.status(401).json({auth: false,msg: "incorrect"});
                }
            }
        });
    },
    signup: async(req,res)=>{
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);
        
        const userName = req.body.un;
        const userPassword = req.body.pw;
        let storedHash = await UserAuth.find({user_id:userName}).limit(1);
        if(storedHash.length > 0) return res.status(401).json({sign:false,msg:"already exists"});
        

        return await bcrypt.hash(userPassword,saltRounds).then(async (hash) => {
                console.log('Hashed Password:', hash);
                const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, {user_id: userName,"hash": hash});
                
                let newFrag = await new UserAuth(merged);
                return newFrag.save().then(
                    res.status(200).json({sign:true,msg:"user created"})
                    //res.status(201).send()
                );
                const newUser = await UserAuth.inse
                return res.status(200).json({sign:true,msg:"user created"});
            
        },(err)=>{
            console.error('Error hashing password:', err);
            return res.status(401).json({sign:false,msg:"error"});
        });

        return await bcrypt.hash(userPassword,saltRounds, async (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(401).json({sign:false,msg:"error"});
            } else {
                console.log('Hashed Password:', hash);
                const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, {user_id: userName,hash: hash});
                
                let newFrag = await new UserAuth(merged);
                return newFrag.save().then(
                    res.status(200).json({sign:true,msg:"user created"})
                    //res.status(201).send()
                );
                const newUser = await UserAuth.inse
                return res.status(200).json({sign:true,msg:"user created"});
            }
        });
    },
    verifyJWT: (req, res, next)=>{
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
        
        jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
          if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
          console.log("jwt has retrieved: ");
          console.log(decoded);
          // se tudo estiver ok, salva no request para uso posterior
          req.userId = decoded.sub;
          req.userName=decoded.name;
          next();
        });
    },
    exibitUser: async(req,res)=>{
        /* console.log(req.body);
        console.log(req.query);
        console.log(req.params); */
        console.log(req);
        return res.status(201).send();
        const userName = req.body.un;
        const userPassword = req.body.pw;
        let storedHash = await UserAuth.find({user_id:userName}).limit(1);
        if(storedHash.length <= 0) return res.status(401).json({auth: false,msg: "incorrect"});
        
        bcrypt.compare(userPassword, storedHash[0].hash, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(401).json({auth: false,msg: "error"});
            } else {
                if (result) {
                    console.log(userName + ' logged in');
                    
                    const payload = {
                        sub: storedHash[0]._id,
                        name: userName,
                        exp: Math.floor(Date.now() / 1000) + 60,// + 3600, // Token expires in 1 hour
                    };

                    const accessToken = jwt.sign(payload, process.env.JWT_KEY);
                    return res.status(200).json({auth: true,msg: "logged in",accessToken: accessToken});
                } else {
                    console.log('Password incorrect for '+userName);
                    return res.status(401).json({auth: false,msg: "incorrect"});
                }
            }
        });
    },
}