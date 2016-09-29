import {Router, Response, Request} from "express";
import * as jwt from "express-jwt";
import * as _ from "lodash";
import {secret} from "../config";
var debug = require('debug')('server:routes:formation');
import Formation from "../models/formation";
import User = require("../models/user");
import UserChoice = require("../models/userChoice");
import isUndefined = require("lodash/isUndefined");
import IUserFormation = require("../models/iUserFormation");
import IUserChoices = require("../models/iUserChoices");
import Paragraph = require("../models/paragraph");
import {IFormationPart} from "../models/iFormationPart";
import {IParagraph} from "../models/iParagraph";


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
        //debug(formations);
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

    debug("PUT /" + formationId + "/userValues");
    //debug(request.body);

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
          user.formations[formationId] = new IUserFormation();
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
            response.status(500).json({status: 500, message: "System error " + err});
          })

      })
      .catch(err => {
        console.log(err);
        response.status(500).json({status: 500, message: "System error " + err});
      });

    //response.status(404).json({status: 404, message: "Formation not found"});

  });

formationRouter.route('/:formation_id/:paragraph_id/userChoice')
// ============================================
// update user choice for a formation paragraph
// ============================================
  .put((request: Request, response: Response) => {

    var formationId = request.params.formation_id;
    var paragraphId = request.params.paragraph_id;

    debug("PUT /" + formationId + "/" + paragraphId + "/userChoice");
    //debug(request.body);

    var userChoice = new UserChoice(request.body);
    //debug(userChoice);

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
          user.formations[formationId] = new IUserFormation();
        }
        if (!user.formations[formationId].userChoices) {
          user.formations[formationId].userChoices = {};
        }
        if (!user.formations[formationId].userChoices[paragraphId]) {
          user.formations[formationId].userChoices[paragraphId] = new IUserChoices();
        }

        user.formations[formationId].userChoices[paragraphId].userChoice = userChoice.userChoice;
        user.formations[formationId].userChoices[paragraphId].updated = new Date();
        //console.log(user);

        // Save the user back to Db
        User.updateOrCreate(user)
          .then(user => {
            //debug(user);

            _getFormationParagraph(formationId, paragraphId, request['user']["id"], response);
          })
          .catch(err => {
            console.log(err);
            response.status(500).json({status: 500, message: "System error " + err});
          })

      })
      .catch(err => {
        console.log(err);
        response.status(500).json({status: 500, message: "System error " + err});
      });

  });

formationRouter.route('/:formation_id/:paragraph_id/userChoice/check')
// ============================================
// check user choice for a formation paragraph
// ============================================
  .put((request: Request, response: Response) => {

    var formationId = request.params.formation_id;
    var paragraphId = request.params.paragraph_id;

    debug("PUT /" + formationId + "/" + paragraphId + "/userChoice/check'");
    //debug(request.body);

    var userChoice = new UserChoice(request.body);
    //debug(userChoice);

    // Search the user (to check if check can be done)
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
          user.formations[formationId] = new IUserFormation();
        }
        if (!user.formations[formationId].userChoices) {
          user.formations[formationId].userChoices = {};
        }
        if (!user.formations[formationId].userChoices[paragraphId]) {
          user.formations[formationId].userChoices[paragraphId] = new IUserChoices();
        }

        user.formations[formationId].userChoices[paragraphId].userChoice = userChoice.userChoice;
        if (!user.formations[formationId].userChoices[paragraphId].userCheckCount) {
          user.formations[formationId].userChoices[paragraphId].userCheckCount = 0;
        }


        // get the paragraph
        Formation.findById(formationId)
          .then(formation => {
            let paragraph = _searchParagraph(paragraphId, formation.parts);
            if (paragraph != null) {
              // check the user choice
              if (paragraph.maxCheckCount <= user.formations[formationId].userChoices[paragraphId].userCheckCount) {
                // Too many try, won't be saved
                response.status(401).json({status: 401, message: "To many try"});
              } else if (user.formations[formationId].userChoices[paragraphId].userCheckOK === true) {
                // Answer already correct
                response.status(401).json({status: 401, message: "Answer already correct"});
              } else {
                // Do the check
                user.formations[formationId].userChoices[paragraphId].userCheckOK = (""+user.formations[formationId].userChoices[paragraphId].userChoice == ""+paragraph.answer);
                user.formations[formationId].userChoices[paragraphId].userCheckCount += 1;
                user.formations[formationId].userChoices[paragraphId].updated = new Date();

                // save it to Db
                User.updateOrCreate(user)
                  .then(user => {
                    //debug(user);

                    _getFormationParagraph(formationId, paragraphId, request['user']["id"], response);
                  })
                  .catch(err => {
                    console.log(err);
                    response.status(500).json({status: 500, message: "System error " + err});
                  })
              }

            } else {
              response.status(404).json({status: 404, message: "Formation not found"});
            }
          })
          .catch(err => {
            console.log(err);
            response.status(500).send("System error " + err);
          });

      })
      .catch(err => {
        console.log(err);
        response.status(500).json({status: 500, message: "System error " + err});
      });

  });

/**
 * fill formation with user data
 * @param formation
 * @param user (from Db, not from token... should be full)
 * @returns {Promise<Formation>}
 * @private
 */
function _fillFormationForUser(formation: Formation, user: User): Promise < Formation > {
  //debug("_fillFormationForUser : " + formation["id"] + ", " + user["id"]);
  return new Promise < Formation >((resolve) => {
    var f = formation;

    // define the default values
    var isFavorite = false;
    var interest = 0;
    var dateFollowed = null;
    var dateFollowedEnd = null;
    var percentFollowed = 0;

    // get values from the user
    if (user && user.formations && user.formations[formation["id"]]) {
      isFavorite = user.formations[formation["id"]].isFavorite;
      interest = user.formations[formation["id"]].interest;
      dateFollowed = user.formations[formation["id"]].dateFollowed;
      dateFollowedEnd = user.formations[formation["id"]].dateFollowedEnd;
      percentFollowed = user.formations[formation["id"]].percentFollowed;

      // add user choices
      if (user.formations[formation["id"]].userChoices) {

        _.forIn(user.formations[formation["id"]].userChoices, (value, paragraphId) => {
          let p = _searchParagraph(paragraphId, f.parts);
          if (p) {
            //console.log(p);
            p.userChoice = value.userChoice;
            p.userCheckCount = value.userCheckCount;
            p.userCheckOK = value.userCheckOK;

            // remove the answer to not spoil !!
            if ((value.userCheckCount == null) || (value.userCheckCount < p.maxCheckCount)) {
              p.answer = null;
            }
          }
        })
      }
    }

    // assign the values into the formation
    _.assign(f, {
      isFavorite: isFavorite,
      interest: interest,
      dateFollowed: dateFollowed,
      dateFollowedEnd: dateFollowedEnd,
      percentFollowed: percentFollowed,
      id: f['_id']
    });

    resolve(f);
  })
}
/**
 * Get a formation (filled) by Id
 * @param formationId
 * @param userId
 * @param response
 * @private
 */
function _getFormation(formationId: string, userId: string, response) {
  //debug("_getFormation : " + formationId + ", " + userId);
  Formation.findById(formationId)
    .then(formation => {
      // Search the user
      User.findById(userId)
        .then(user => {
          if (formation) {
            _fillFormationForUser(formation, user)
              .then(form => {
                //debug(form);
                response.json({data: form})
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

/**
 * Get a paragraph (filled) by Id
 * @param formationId
 * @param paragraphId
 * @param userId
 * @param response
 * @private
 */
function _getFormationParagraph(formationId: string, paragraphId: string, userId: string, response) {
  //debug("_getFormation : " + formationId + ", " + userId);
  Formation.findById(formationId)
    .then(formation => {

      // Search the user
      User.findById(userId)
        .then(user => {
          if (formation) {
            _fillFormationForUser(formation, user)
              .then(form => {
                // search for the paragraph
                let para = _searchParagraph(paragraphId, form.parts);
                if (para != null) {
                  response.json({data: para})
                } else {
                  response.status(404).json({status: 404, message: "Formation not found"});
                }
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

/**
 * Search for a paragraphe within formation parts
 * @param paragraphId
 * @param formationParts
 * @returns  the earched paragraph
 */
function _searchParagraph(paragraphId: string, formationParts: IFormationPart[]): IParagraph {

  let returnedParagraph: IParagraph = null;

  if (formationParts == null) {
    return null;
  }

  formationParts.forEach(part => {
    if (part.contents != null) {
      part.contents.forEach(para => {
        if (paragraphId == para['_id']) {
          returnedParagraph = para;
        }
      });
    }
    if (returnedParagraph == null) {
      returnedParagraph = _searchParagraph(paragraphId, part.parts);
    }
  });

  return returnedParagraph;

}


export {formationRouter}





