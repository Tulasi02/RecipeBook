const {v4: uuidv4} = require('uuid');
const User = require('../models/User');
const Recipes = require('../models/Recipes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtExpirySeconds = 15 * 60;
let jwtKey = process.env.JWT_SECRET_KEY;

exports.profile = (req, res, next) => {
    var userData = {};
    User.findOne({userId : req.body.userId}, (err, data) => {
        if (err) {
            throw err;
        }
        else  if(data.length != 0) {
            const details = {name: data.name, emailId: data.emailId};
            // console.log("1", details);
            userData.details = details;
            Recipes.find({creatorId : req.body.userId}, (err, data) => {
                if (err) {
                    throw err;
                }
                else  if (data.length != 0) {
                    const userRecipes = data.map(x => {
                        return {name: x.name, recipeId: x.recipeId};
                    });
                    userData.recipes = userRecipes;
                }
                else {
                    userData.recipes = [];
                }
                res.json({message : "success", user: userData});
            })
        }
        else {
            res.send({message: 'User not found'});
        }
    })
}

exports.signup = (req, res, next) => {
    // res.status(200).send({message : "Sign up"});
    User.find({emailId : req.body.emailId}, (err, data) => {
        if(err) {
            throw err;
        }
        res.send({message : "Email Id already registered"});
    })
    const user = new User({
        name : req.body.name,
        userId : uuidv4(),
        emailId : req.body.emailId,
        password : req.body.password,
    });
    user.password = bcrypt.hashSync(user.password, 10);
    user.save().then(() => {
        res.status(200).send({message : "success"});
    })
    .catch(err => {
        return next(err);
    })
};

exports.update = (req, res, next) => {
    var password1 = req.body.password1, password2 = req.body.password2;
    if (password1 && password2) {
        if (password1 != password2) {
            res.send({message : "Passwords don't match"})
        }
        else {
            password1 = bcrypt.hashSync(password1, 10);
            User.updateOne({userId : req.body.userId}, {$set : {password : password1}}, (err, data) => {
                if (err) {
                    throw err;
                }
                res.status(200).send({message : "success"});
            })
        }
    }
}

exports.login = (req, res, next) => {
    // res.status(200).send({message : "Login"});
    const email = req.body.emailId, passW = req.body.password;
    User.findOne({emailId : email}, (err, data) => {
        if (err) {
            throw err;
        }
        if (!data) {
            res.send({message : "Email not registered"});
        }
        else if (!bcrypt.compareSync(passW, data.password)) {
            res.json({message : "Incorrect Password"});
        }
        else {
            var token = jwt.sign({id : data.userId}, jwtKey, {
                algorithm : "HS256",
                expiresIn : jwtExpirySeconds,
            })
            res.setHeader("token",token);
            res.send({message : "success"});
        }
    });
};