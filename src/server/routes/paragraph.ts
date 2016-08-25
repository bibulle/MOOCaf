import {Router, Response, Request, NextFunction} from "express";
import {secret} from "../config";
import * as jwt from "express-jwt";
import {Paragraph} from "../models/paragraph";
var debug = require('debug')('server:paragraph');
import * as _ from 'lodash';


const paragraphRouter: Router = Router();

var jwtCheck = jwt({
  secret: "jgjhghjg"
});

paragraphRouter.use(jwtCheck);

// TODO : Add real access to a database

// rout for all paragraphs
paragraphRouter.route('/')
  .get((request: Request, response: Response) => {
    debug("connected user : " + JSON.stringify(request['user']));
    let paragraphs = Paragraph.find();
    response.json({data: paragraphs});
  });

// rout for one paragraphs
paragraphRouter.route('/:paragraph_id')

// get a paragraph
  .get((request: Request, response: Response) => {
    let uid = request.params.paragraph_id;
    debug("connected user : " + JSON.stringify(request['user']));
    let paragraph = Paragraph.find()
      .find(p => {
        return p.id === uid
      });

    if (paragraph) {
      response.json({data: paragraph});
    } else {
      response.status(404).json({status: 404, message: "Paragraph not found"});
    }

  })

  // upsdate a paragraph
  .put((request: Request, response: Response) => {
    var p = request.body;
    debug(p);

    let paragraphs = Paragraph.find();

    var index = _.indexOf(paragraphs, _.find(paragraphs, { id: p.id}));
    debug(index);

    if (index >= 0) {
      paragraphs.splice(index, 1, p);

      debug(paragraphs[index]);
      debug(Paragraph.find()[index]);


      response.json({data: p});
    } else {
      response.status(404).json({status: 404, message: "Paragraph not found"});
    }

  });


export {paragraphRouter}





