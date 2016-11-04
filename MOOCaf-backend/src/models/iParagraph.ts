import Mongoose = require("mongoose");
import * as _ from "lodash";

import {ParagraphType} from "./eParagraphType";
import {IParagraphContent} from "./iParagraphContent";
var debug = require('debug')('server:model:paragraph');

export class IParagraph {

  // The type
  type: ParagraphType;

  // The markdown rawContent
  public content: IParagraphContent = new IParagraphContent();

  // if it's form... the correct answer
  answer: any;

  // If it's form how many check can the user do
  maxCheckCount: number;

  // The user choice (won't be in the model because coming from the user)
  userChoice: any;
  // If the user choice checked ok(true), ko(false) or undefined  (won't be in the model because coming from the user)
  userCheckOK: boolean;
  // Check done by the user  (won't be in the model because coming from the user)
  userCheckCount: number;
  // the user has done this paragraph  (won't be in the model because coming from the user)
  userDone: Date;
  // Response on user choice test(won't be in the model because coming from the user)
  userChoiceReturn: any;

  created: Date;
  updated: Date;


  /**
   * Constructor
   * @param document
   */
  constructor(document: {}) {
    _.merge(this, document);

    if (this.content == null) {
      this.content = new IParagraphContent();
    }

    //debug(this);

  }

}

/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
export var schemaParagraph: Mongoose.Schema = new Mongoose.Schema();
schemaParagraph.add({

  type: {
    type: ParagraphType,
    require: true
  },
  content: {
    type: Mongoose.Schema.Types.Mixed,
    'default': new IParagraphContent()
  },
  answer: {
    type: Mongoose.Schema.Types.Mixed,
    require: false
  },
  maxCheckCount: {
    type: Number,
    require: false
  },
  created: {
    type: Date,
    'default': Date.now
  },
  updated: {
    type: Date,
    'default': Date.now
  }

});

