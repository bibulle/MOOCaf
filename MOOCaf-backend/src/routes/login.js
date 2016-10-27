"use strict";
const express_1 = require("express");
const _ = require("lodash");
const statService_1 = require("../service/statService");
const userService_1 = require("../service/userService");
const User = require("../models/user");
var debug = require('debug')('server:route:login');
const loginRouter = express_1.Router();
exports.loginRouter = loginRouter;
// ====================================
// route to signup (create a new user)
// ====================================
loginRouter.route('/')
    .post((request, response) => {
    var password = request.body['password'];
    if (!request.body.username || !password) {
        debug("400 : You must send the username and the password");
        return response.status(400).send("You must send the username and the password");
    }
    User.findByUsername(request.body.username)
        .then(user => {
        if (user) {
            debug("400 : A user with that username already exists");
            return response.status(400).send("A user with that username already exists");
        }
        var user = new User(_.pick(request.body, 'username', 'firstname', 'lastname', 'email'));
        // Hash password
        user.salt = userService_1.default.getSalt();
        userService_1.default.createHash(password, user.salt, function (err, hash) {
            if (err) {
                console.log(err);
                return response.status(500).send("Cannot create user " + err);
            }
            user.hashedPassword = hash.toString("hex");
            User.updateOrCreate(user)
                .then(user => {
                debug("200 : user created(" + user.username + ")");
                response.status(200).send("User created");
            })
                .catch(err => {
                console.log(err);
                response.status(500).send("Cannot create user : " + err);
            });
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).send("Cannot create user " + err);
    });
});
// ====================================
// route to login (retrieve a JWT token)
// ====================================
loginRouter.route('/login')
    .post((request, response) => {
    var password = request.body['password'];
    //debug("login : " + request.body.username + " " + request.body.password);
    if (!request.body.username || !password) {
        debug("400 : You must send the username and the password");
        return response.status(400).send("You must send the username and the password");
    }
    User.findByUsername(request.body.username)
        .then(user => {
        if (!user) {
            debug("401 : The username or password don't match : 1");
            return response.status(401).send("The username or password don't match");
        }
        statService_1.default.calcStatsUser(user['id']);
        userService_1.default.createHash(password, user.salt, function (err, hash) {
            if (err) {
                console.log(err);
                return response.status(500).send("System error " + err);
            }
            if (!(user.hashedPassword === hash.toString("hex"))) {
                debug("401 : The username or password don't match : 2");
                return response.status(401).send("The username or password don't match");
            }
            debug("201 : token created(" + request.body.username + ")");
            response.status(201).send({
                id_token: userService_1.default.createToken(user)
            });
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
    });
});
//# sourceMappingURL=login.js.map