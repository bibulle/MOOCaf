import {Router, Response, Request} from "express";
import * as jwt from "express-jwt";
import * as _ from "lodash";
import {secret} from "../config";
var debug = require('debug')('server:paragraph');
import Paragraph = require("../models/paragraph");
import User = require("../models/user");
import UserChoice = require("../models/userChoice");


const paragraphRouter: Router = Router();

// Add JWT management
var jwtCheck = jwt({
  secret: secret
});
paragraphRouter.use(jwtCheck);

// ====================================
// route for all paragraphs
// ====================================
paragraphRouter.route('/')
  .get((request: Request, response: Response) => {
    debug("GET /");
    //debug("connected user : " + JSON.stringify(request['user']));
    Paragraph.find()
      .then(paragraphs => {
        // fill each paragraph with users values
        var promises = _.map(paragraphs,
          p => _fillParagraphForUser(p, request['user']));
        Promise.all(promises)
          .then(completedParagraphs => {
            response.json({data: completedParagraphs})
          })
          .catch(err => {
            console.log(err);
            response.status(500).send("System error " + err);
          });
      })
      .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
      });
  });

// ====================================
// route for one paragraphs
// ====================================
paragraphRouter.route('/:paragraph_id')

// get a paragraph
  .get((request: Request, response: Response) => {
    debug("GET /" + request.params.paragraph_id);
    let uid = request.params.paragraph_id;
    //debug("connected user : " + JSON.stringify(request['user']));
    Paragraph.findById(uid)
      .then(paragraph => {
        if (paragraph) {
          response.json({data: _fillParagraphForUser(paragraph, request['user'])});
        } else {
          response.status(404).json({status: 404, message: "Paragraph not found"});
        }
      })
      .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
      });


  })

  // update a paragraph
  .put((request: Request, response: Response) => {

    var paragraph = new Paragraph(request.body);
    debug(paragraph);
    debug("PUT /" + request.params.paragraph_id);

    Paragraph.updateOrCreate(paragraph)
      .then(paragraph => {
        if (paragraph) {
          response.json({data: paragraph});
        } else {
          response.status(404).json({status: 404, message: "Paragraph not found"});
        }
      })
      .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
      });

  });

// ====================================
// route for editing userChoice
// ====================================
paragraphRouter.route('/:paragraph_id/userchoice')

// update a userChoice
  .put((request: Request, response: Response) => {

    var userChoice = new UserChoice(request.body);
    debug("PUT /" + request.params.paragraph_id + "/userchoice");

    // add user to the choice
    userChoice.userId = request['user'].id;

    UserChoice.updateOrCreate(userChoice)
      .then(paragraph => {
        if (paragraph) {
          response.json({data: paragraph});
        } else {
          response.status(404).json({status: 404, message: "UserChoice not found"});
        }
      })
      .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
      });

  });

function _fillParagraphForUser(paragraph: Paragraph, user: User): Promise < Paragraph > {
  return new Promise < Paragraph >((resolve, reject) => {
    var p = paragraph['_doc'];
    var answer = p.answer;
    p = _.omit(p, "answer");

    // get the userchoice from the db
    UserChoice.findByParaAndUser(paragraph["id"], user["id"])
      .then(userChoice => {
        // Default values
        var userCheckCount = 0;
        var userCheckOK;
        var userChoiceValue = [];

        if (userChoice) {
          userCheckCount = userChoice.userCheckCount;
          userCheckOK = userChoice.userCheckOK;
          userChoiceValue = userChoice.userChoice;
        }
        _.assign(p, {
          userCheckCount: userCheckCount,
          userCheckOK: userCheckOK,
          userChoice: userChoiceValue,
          // TODO : Shall we stay on the _id within the client ?
          id: p['_id']
        });

        // If user cannot search anymore, send the answer
        if (p.userCheckCount >= p.maxCheckCount) {
          p.answer = answer;
        }

        resolve(p);
      })
      .catch(err => {
        console.log(err);
        reject(err)
      })

  })
}


export {paragraphRouter}





