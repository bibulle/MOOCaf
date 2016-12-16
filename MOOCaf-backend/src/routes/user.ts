import { Router, Request, Response } from "express";
import * as jwt from "express-jwt";
import * as _ from "lodash";
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

            debug("GET /");
            //debug("connected user : " + JSON.stringify(request['user']));

            UserService.checkUserRightAndRespond(userId, EditRightType.ListUsers, null, response, () => {
              User
                .findFilled()
                .then(users => {
                  const ret = users.map(user => {
                    debug(user);
                    return _.omit(user, ['_id', 'salt', 'hashedPassword']);
                  });
                  response.json({ data: ret })
                })
                .catch(err => {
                  console.log(err);
                  response.status(500).send("System error " + err);
                })
            });


          })
          // ============================================
          // update a user
          // ============================================
          .put((request: Request, response: Response) => {

            const userId = request['user']["id"];

            debug("PUT /");
            //debug(request.body);

            const user = new User(request.body);
            debug(user);
            user["_id"] = user["id"];

            UserService.checkUserRightAndRespond(userId, EditRightType.EditUser, null, response, () => {
              // Save the award
              User
                .updateOrCreate(user)
                .then(user => {
                  debug(user);
                  User.fillUser(user, true)
                      .then(user => {
                        response.json({data: user})
                      })
                      .catch(err => {
                        console.log(err);
                        response.status(500).json({status: 500, message: "System error " + err});
                      });
                })
                .catch(err => {
                  console.log(err);
                  response.status(500).json({status: 500, message: "System error " + err});
                });
            });

          });
userRouter.route('/:user_id')
           // ============================================
           // remove an award
           // ============================================
           .delete((request: Request, response: Response) => {

             const removedId = request.params['user_id'];
             const userId = request['user']["id"];

             debug("DELETE /" + removedId);

             UserService.checkUserRightAndRespond(userId, EditRightType.EditUser, null, response, () => {
               // remove it
               User.remove(removedId)
                    .then(() => {
                      User
                        .findFilled()
                        .then(users => {
                          const ret = users.map(user => {
                            return _.omit(user, ['_id', 'salt', 'hashedPassword']);
                          });
                          response.json({ data: ret })
                        })
                        .catch(err => {
                          if (err == "WRONG_USER") {
                            response.status(401).send("WRONG_USER");
                          } else {
                            console.log(err);
                            response.status(500).send("System error " + err);
                          }
                        })
                    })
                    .catch(err => {
                      console.log(err);
                      if (err == "WRONG_USER") {
                        response.status(401).send("WRONG_USER");
                      } else {
                        console.log(err);
                        response.status(500).send("System error " + err);
                      }
                    });
             });
           });




export { userRouter }
