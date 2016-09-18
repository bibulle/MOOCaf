import {Router, Response, Request} from "express";
import * as jwt from "express-jwt";
import * as _ from "lodash";
import {secret} from "../config";
var debug = require('debug')('server:paragraph');
import Formation = require("../models/formation");
import User = require("../models/user");
import UserChoice = require("../models/userChoice");
import isUndefined = require("lodash/isUndefined");


const formationRouter: Router = Router();

// Add JWT management
var jwtCheck = jwt({
  secret: secret
});
//noinspection TypeScriptValidateTypes
formationRouter.use(jwtCheck);

// ====================================
// route for all formations
// ====================================
formationRouter.route('/')
  .get((request: Request, response: Response) => {
    //debug("GET /");
    //debug("connected user : " + JSON.stringify(request['user']));
    Formation.find()
      .then(formations => {
        //debug("find then");
        // fill each paragraph with users values
        var promises = _.map(formations,
          p => _fillFormationForUser(p, request['user']));
        Promise.all(promises)
          .then(completedFormations => {
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
  });

// ====================================
// route for one formation
// ====================================
formationRouter.route('/:formation_id')

// get a formation
  .get((request: Request, response: Response) => {
    //debug("GET /" + request.params.formation_id);
    let uid = request.params.formation_id;
    //debug("connected user : " + JSON.stringify(request['user']));

    _getFormation(uid, request['user'], response);

  })

  // update a formation
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

/**
 * fill formation with user data
 * @param paragraph
 * @param user
 * @returns {Promise<Paragraph>}
 * @private
 */
function _fillFormationForUser(formation: Formation, user: User): Promise < Formation > {
  //debug("_fillFormationForUser : " + formation["id"] + ", " + user["id"]);
  return new Promise < Formation >((resolve, reject) => {
    var f = formation['_doc'];

    // get the full user from the db
    User.findById(user["id"])
      .then(user => {
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
      .catch(err => {
        console.log(err);
        reject(err)
      })
  })
}

function _getFormation(formationId: string, user: User, response) {
  //debug("_getFormation : " + formationId + ", " + user["id"]);
  Formation.findById(formationId)
    .then(paragraph => {
      if (paragraph) {
        _fillFormationForUser(paragraph, user)
          .then(para => {
            response.json({data: para})
          })
          .catch(err => {
            console.log(err);
            response.status(500).send("System error " + err);
          })
        ;
      } else {
        response.status(404).json({status: 404, message: "Formation not found"});
      }
    })
    .catch(err => {
      console.log(err);
      response.status(500).send("System error " + err);
    });

}


export {formationRouter}





