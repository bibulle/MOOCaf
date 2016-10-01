import Mongoose = require("mongoose");
import * as _ from "lodash";

import {ParagraphType} from "./eParagraphType";
import {IParagraphContent} from "./iParagraphContent";
var debug = require('debug')('server:model:course');

export class IParagraph {

  // The type
  type: ParagraphType;

  // The markdown rawContent
  public content: IParagraphContent[] = new Array<IParagraphContent>();

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

  created: Date;
  updated: Date;


  /**
   * Constructor
   * @param mongoose.Document<IUser>
   */
  constructor(document: {}) {
    _.merge(this, document);

    if (!this.content) {
      this.content = new Array<IParagraphContent>();
    }

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
    type: [],
    default: new Array<IParagraphContent>()
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
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }

});

