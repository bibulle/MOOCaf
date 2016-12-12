import { Router, Request, Response } from "express";
import * as jwt from "express-jwt";
import { secret } from "../config";
import UserService, { EditRightType } from "../service/userService";
import User = require("../models/user");

const debug = require('debug')('server:route:user');


const userRouter: Router = Router();

// Add JWT management
const jwtCheck = jwt({
  secret: secret
});
//noinspection TypeScriptValidateTypes
userRouter.use(jwtCheck);

// ====================================
// route to get users
// ====================================
userRouter.route('/')
          .get((request: Request, response: Response) => {

            const userId = request['user']["id"];

            debug("GET /awards");
            //debug("connected user : " + JSON.stringify(request['user']));

            UserService.checkUserRightAndRespond(userId, EditRightType.ListUsers, null, response, () => {
              User
                .find()
                .then(users => {
                  response.json({ data: users })
                })
                .catch(err => {
                  console.log(err);
                  response.status(500).send("System error " + err);
                })
            });


          });

export { userRouter }
