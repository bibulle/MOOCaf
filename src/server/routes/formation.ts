import {Router, Response, Request} from "express";
import * as jwt from "express-jwt";
import * as _ from "lodash";
import {secret} from "../config";
var debug = require('debug')('server:paragraph');
import Formation = require("../models/formation");
import User = require("../models/user");
import UserChoice = require("../models/userChoice");
import isUndefined = require("lodash/isUndefined");
import UserFormation = require("../models/user-formation");


const formationRouter: Router = Router();

// Add JWT management
var jwtCheck = jwt({
  secret: secret
});
//noinspection TypeScriptValidateTypes
formationRouter.use(jwtCheck);

// -----------------------------------
// --     /api/formation routes     --
// -----------------------------------


// ====================================
// route getting for all formations
// ====================================
formationRouter.route('/')
  .get((request: Request, response: Response) => {
    //debug("GET /");
    //debug("connected user : " + JSON.stringify(request['user']));

    var currentOnly = false;
    if (request.query['currentOnly']) {
      currentOnly = (request.query['currentOnly'] === "true");
    }

    Formation.find()
      .then(formations => {
        // Search the user
        User.findById(request['user']["id"])
          .then(user => {
            // fill each paragraph with users values
            var promises = _.map(formations,
              p => _fillFormationForUser(p, user));
            Promise.all(promises)
              .then(completedFormations => {

                // filter if we only need the currents one
                if (currentOnly) {
                  completedFormations = completedFormations
                    .filter(f => {
                      return (f.dateFollowed && !f.dateFollowedEnd)
                    })
                }

                response.json({data: completedFormations})
              })
              .catch(err => {
                console.log(err);
                response.status(500).send("System error " + err);
              });
          })
          .catch(err => {
            //debug("find catch");
            console.log(err);
            response.status(500).send("System error " + err);
          });
      })
      .catch(err => {
        //debug("find catch");
        console.log(err);
        response.status(500).send("System error " + err);
      });
  });

formationRouter.route('/:formation_id')
  // ====================================
  // route for getting one formation
  // ====================================
  .get((request: Request, response: Response) => {
    //debug("GET /" + request.params.formation_id);
    let formationId = request.params['formation_id'];
    //debug("connected user : " + JSON.stringify(request['user']));

    _getFormation(formationId, request['user']["id"], response);

  })

  // ====================================
  // update a formation
  // ====================================
  .put((request: Request, response: Response) => {

    var formation = new Formation(request.body);
    //debug(formation);
    //debug("PUT /" + request.params.formation_id);

    Formation.updateOrCreate(formation)
      .then(formation => {
        if (formation) {
          response.json({data: formation});
        } else {
          response.status(404).json({status: 404, message: "Formation not found"});
        }
      })
      .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
      });

  });


formationRouter.route('/:formation_id/userValues')
  // ====================================
  // update user values for a formation
  // ====================================
  .put((request: Request, response: Response) => {

    var formationId = request.params.formation_id;

    debug("PUT /" + formationId+"/userValues");
    debug(request.body);

    // Search the user
    User.findById(request['user']["id"])
      .then(user => {
        //console.log(user);
        if (!user) {
          return response.status(404).json({status: 404, message: "User not found"});
        }

        if (!user.formations) {
          user.formations = {};
        }
        if (!user.formations[formationId]) {
          user.formations[formationId] = new UserFormation();
        }

        user.formations[formationId].isFavorite = request.body.isFavorite;
        //console.log(user);

        // Save the user back to Db
        User.updateOrCreate(user)
          .then(user => {
            //console.log(user);

            _getFormation(formationId, request['user']["id"], response);
          })
          .catch(err => {
            console.log(err);
            response.status(500).json({status: 500, message: "System error "+err});
          })

      })
      .catch(err => {
        console.log(err);
        response.status(500).json({status: 500, message: "System error "+err});
      });

    //response.status(404).json({status: 404, message: "Formation not found"});

  });

/**
 * fill formation with user data
 * @param formation
 * @param user (from Db, not from token... should be full)
 * @returns {Promise<Paragraph>}
 * @private
 */
function _fillFormationForUser(formation: Formation, user: User): Promise < Formation > {
  //debug("_fillFormationForUser : " + formation["id"] + ", " + user["id"]);
  return new Promise < Formation >((resolve) => {
    var f = formation['_doc'];

    var isFavorite = false;
    var interest = 0;
    var dateFollowed = null;
    var dateFollowedEnd = null;
    var percentFollowed = 0;

    if (user && user.formations && user.formations[formation["id"]]) {
      isFavorite = user.formations[formation["id"]].isFavorite;
      interest = user.formations[formation["id"]].interest;
      dateFollowed = user.formations[formation["id"]].dateFollowed;
      dateFollowedEnd = user.formations[formation["id"]].dateFollowedEnd;
      percentFollowed = user.formations[formation["id"]].percentFollowed;
    }
    _.assign(f, {
      isFavorite: isFavorite,
      interest: interest,
      dateFollowed: dateFollowed,
      dateFollowedEnd: dateFollowedEnd,
      percentFollowed: percentFollowed,
      // TODO : Shall we stay on the _id within the client ?
      id: f['_id']
    });

    resolve(f);
  })
}
/**
 *
 * @param formationId
 * @param userId
 * @param response
 * @private
 */
function _getFormation(formationId: string, userId: string, response) {
  //debug("_getFormation : " + formationId + ", " + userId);
  Formation.findById(formationId)
    .then(paragraph => {
      // Search the user
      User.findById(userId)
        .then(user => {
          if (paragraph) {
            _fillFormationForUser(paragraph, user)
              .then(para => {
                // console.log(para);
                response.json({data: para})
              })
              .catch(err => {
                console.log(err);
                response.status(500).send("System error " + err);
              });
          } else {
            response.status(404).json({status: 404, message: "Formation not found"});
          }
        })
        .catch(err => {
          console.log(err);
          response.status(500).send("System error " + err);
        })
    })
    .catch(err => {
      console.log(err);
      response.status(500).send("System error " + err);
    });

}


export {formationRouter}





