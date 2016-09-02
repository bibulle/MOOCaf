import {Router, Response, Request} from "express";
import * as jwt from "express-jwt";
import * as _ from "lodash";
import {secret} from "../config";
var debug = require('debug')('server:paragraph');
import Paragraph = require("../models/paragraph");
import User = require("../models/user");
import UserChoice = require("../models/userChoice");
import isUndefined = require("lodash/isUndefined");


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

    _getParagraph(uid, request['user'], response);

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
// route for checking userChoice
// ====================================
paragraphRouter.route('/:paragraph_id/userchoice/check')

// check a userChoice
  .put((request: Request, response: Response) => {

    var userChoice = new UserChoice(request.body);
    debug("PUT /" + request.params.paragraph_id + "/userchoice/check");

    // add user to the choice
    userChoice.userId = request['user'].id;

    // Check if save should be done
    isUserChoiceAllowed(userChoice)
      .then(ret => {
        if (ret.err) {
          // No save due to a warning
          response.status(500).send("No check : " + ret.err);
        } else {
          // Check answer
          ret.userChoice.userCheckOK = (ret.userChoice.userChoice === ret.paragraph.answer);
          ret.userChoice.userCheckCount += 1;

          // Just save it
          UserChoice.updateOrCreate(userChoice)
            .then(ret => {
              // reload paragraph
              _getParagraph(userChoice.paragraphId, request['user'], response);
            })
            .catch(err => {
              console.log(err);
              response.status(500).send("System error " + err);
            });
        }
      })
      .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
      })
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

    // Check if save should be done
    isUserChoiceAllowed(userChoice)
      .then(ret => {
        if (ret.err) {
          // No save due to a warning
          response.status(500).send("No save : " + ret.err);
        } else {
          // Just save it
          UserChoice.updateOrCreate(userChoice)
            .then(ret => {
              // reload paragraph
              _getParagraph(userChoice.paragraphId, request['user'], response);
            })
            .catch(err => {
              console.log(err);
              response.status(500).send("System error " + err);
            });
        }
      })
      .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
      })
  });


function isUserChoiceAllowed(userChoice: UserChoice): Promise<{ err: string, userChoice: UserChoice, paragraph: Paragraph }> {

  var ret: {
    err: string,
    userChoice: UserChoice,
    paragraph: Paragraph
  } = {
    err: null,
    userChoice: userChoice,
    paragraph: null
  };

  return new Promise((resolve, reject) => {

    // update userChoice with the one in Db (if any)
    // Check with paragraph in db if modification are allowed

    UserChoice.findByParaAndUser(userChoice.paragraphId, userChoice.userId)
      .then(savedUserChoice => {
        // Verify and set userChoice correctly
        if (!savedUserChoice) {
          // init user choice value
          ret.userChoice.userCheckCount = 0;
        } else {
          // set user choice value
          ret.userChoice.userCheckCount = savedUserChoice.userCheckCount;
          ret.userChoice.userCheckOK = savedUserChoice.userCheckOK;
        }

        Paragraph.findById(userChoice.paragraphId)
          .then(paragraph => {
            ret.paragraph = paragraph;
            if (!paragraph) {
              // Real Error
              ret.err = "Paragraph not found (" + userChoice.paragraphId + ")";
              console.log(ret.err);
              reject(new Error(ret.err));
            } else if (paragraph.maxCheckCount <= ret.userChoice.userCheckCount) {
              // Too many try, won't be saved
              ret.err = "No more check";
              console.log(ret.err);
            } else if (ret.userChoice.userCheckOK) {
              // Answer already correct
              ret.err = "Answer already correct";
              console.log(ret.err);
            }
            resolve(ret);
          })

      })
      .catch(err => {
        console.log(err);
        ret.err = err;
        reject(err);
      });


  });
}

/**
 * fill paragraph with user data
 * @param paragraph
 * @param user
 * @returns {Promise<Paragraph>}
 * @private
 */
function _fillParagraphForUser(paragraph: Paragraph, user: User): Promise < Paragraph > {
  //debug("_fillParagraphForUser : " + paragraph["id"] + ", " + user["id"]);
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

function _getParagraph(paragraphId: string, user: User, response) {
  debug("_getParagraph : " + paragraphId + ", " + user["id"]);
  Paragraph.findById(paragraphId)
    .then(paragraph => {
      if (paragraph) {
        _fillParagraphForUser(paragraph, user)
          .then(para => {
            response.json({data: para})
          })
          .catch(err => {
            console.log(err);
            response.status(500).send("System error " + err);
          })
        ;
      } else {
        response.status(404).json({status: 404, message: "Paragraph not found"});
      }
    })
    .catch(err => {
      console.log(err);
      response.status(500).send("System error " + err);
    });

}


export {paragraphRouter}





