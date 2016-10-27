import {Router, Request, Response} from "express";
import * as _ from "lodash";

import StatService from "../service/statService";
import UserService from "../service/userService";
import User = require("../models/user");

var debug = require('debug')('server:route:login');


const loginRouter: Router = Router();

// ====================================
// route to signup (create a new user)
// ====================================
loginRouter.route('/')
  .post((request: Request, response: Response) => {

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
        user.salt = UserService.getSalt();

        UserService.createHash(password, user.salt, function (err, hash: Buffer) {
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
            })
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
  .post((request: Request, response: Response) => {

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

        StatService.calcStatsUser(user['id']);

        UserService.createHash(password, user.salt, function (err, hash: Buffer) {
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
            id_token: UserService.createToken(user)
          });
        })
      })
      .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
      });
  });

export {loginRouter}
