import {Router, Response, Request, NextFunction} from "express";
import * as jwt from "express-jwt";
var debug = require('debug')('server:paragraph');
import * as _ from 'lodash';
import {secret} from "../config";
import Paragraph = require("../models/paragraph");
import User = require("../models/user");


const paragraphRouter: Router = Router();

// Add JWT management
var jwtCheck = jwt({
  secret: secret
});
paragraphRouter.use(jwtCheck);

// rout for all paragraphs
paragraphRouter.route('/')
  .get((request: Request, response: Response) => {
    debug("GET /");
    //debug("connected user : " + JSON.stringify(request['user']));
    Paragraph.find()
      .then(paragraphs => {
        // fill each paragraph with users values
        var ps = _.map(paragraphs,
          p => _fillParagraphForUser(p, request['user']));
        response.json({data: ps})
      })
      .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
      });
  });

// rout for one paragraphs
paragraphRouter.route('/:paragraph_id')

// get a paragraph
  .get((request: Request, response: Response) => {
    debug("GET /"+request.params.paragraph_id);
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
    debug("PUT /"+request.params.paragraph_id);

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


function _fillParagraphForUser(paragraph: Paragraph, user: User) {
  var p = paragraph['_doc'];
  _.assign(p, {
    userCheckCount: 0,
    userCheckOK: false,
    userChoice: [],
    // TODO : Shall we stay on the _id within the client ?
    id: p['_id']
  });

  return p;
}


export {paragraphRouter}





