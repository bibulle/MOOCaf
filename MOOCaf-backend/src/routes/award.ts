import { Router, Request, Response } from "express";
import * as jwt from "express-jwt";

import { secret } from "../config";
import User = require("../models/user");
import Award from "../models/award";
import { IAward } from "../models/iAward";
import { StatKey } from "../models/eStatKey";
import AwardService from "../service/awardService";
import UserService from "../service/userService";
import { EditRightType } from "../service/userService";

var debug = require('debug')('server:route:award');


const awardRouter: Router = Router();

// Add JWT management
var jwtCheck = jwt({
  secret: secret
});
//noinspection TypeScriptValidateTypes
awardRouter.use(jwtCheck);

// ====================================
// route to get user awards
// ====================================
awardRouter.route('/')
           .get((request: Request, response: Response) => {

             var userId = request['user']["id"];

             debug("GET /awards");
             //debug("connected user : " + JSON.stringify(request['user']));

             _respondWithAwardsList(userId, response);
           })
           // ============================================
           // update an award
           // ============================================
           .put((request: Request, response: Response) => {

             var userId = request['user']["id"];

             debug("PUT /awards");
             //debug(request.body);

             var award = new Award(request.body);
             //debug(award);

             UserService.checkUserRightAndRespond(userId, EditRightType.EditAward, null, response, () => {
               // Save the award
               Award
                 .updateOrCreate(award)
                 .then(award => {
                   //debug(award);
                   _respondWithAward(userId, award, response);
                 })
                 .catch(err => {
                   console.log(err);
                   response.status(500).json({status: 500, message: "System error " + err});
                 });
             });

           });

awardRouter.route('/add')
           // ============================================
           // add an award
           // ============================================
           .put((request: Request, response: Response) => {

             var userId = request['user']["id"];

             debug("PUT /add");
             //debug(request.body);

             UserService.checkUserRightAndRespond(userId, EditRightType.EditAward, null, response, () => {
               // Create a new Award
               let award = new IAward({
                 name: "A new award",
                 description: "",
                 level: 3,
                 imgPath: "lock.svg",
                 statKey: StatKey.COUNT_FINISHED_COURSE,
                 limitCount: 0,
                 secret: false
               });

               // save it
               Award.updateOrCreate(award)
                    .then(() => {
                      _respondWithAwardsList(userId, response);
                    })
                    .catch(err => {
                      console.log(err);
                      response.status(500).json({status: 500, message: "System error " + err});
                    });
             });
           });

awardRouter.route('/:award_id')
           // ============================================
           // remove an award
           // ============================================
           .delete((request: Request, response: Response) => {

             var awardId = request.params['award_id'];
             var userId = request['user']["id"];

             debug("DELETE /" + awardId);

             UserService.checkUserRightAndRespond(userId, EditRightType.EditAward, null, response, () => {
               // remove it
               Award.remove(awardId)
                    .then(() => {
                      _respondWithAwardsList(userId, response);
                    })
                    .catch(err => {
                      console.log(err);
                      response.status(500).json({status: 500, message: "System error " + err});
                    });
             });
           });


function _respondWithAward(userId: string, award: Award, response: Response) {
  User.findById(userId)
      .then(user => {
        AwardService.fillAwardForUser(award, user)
                    .then(completedAward => {
                      response.json({data: completedAward})
                    })
                    .catch(err => {
                      console.log(err);
                      response.status(500).send("System error " + err);
                    });
      })
      .catch(err => {
        //debug("find catch");
        if (err == "WRONG_USER") {
          response.status(401).send("WRONG_USER");
        } else {
          console.log(err);
          response.status(500).send("System error " + err);
        }
      });
}

function _respondWithAwardsList(userId: string, response: Response) {
  AwardService.getAwards(userId)
              .then(completedAwards => {
                response.json({data: completedAwards})
              })
              .catch(err => {
                //debug("find catch");
                if (err == "WRONG_USER") {
                  response.status(401).send("WRONG_USER");
                } else {
                  console.log(err);
                  response.status(500).send("System error " + err);
                }
              });
}

export { awardRouter }
