import Mongoose = require("mongoose");
import * as _ from "lodash";

import {IParagraph, schemaParagraph} from "./iParagraph";

var debug = require('debug')('server:model:course-part');

export class ICoursePart {
  title: String;
  parts: ICoursePart[];
  contents: IParagraph[];

  // Percentage users already followed (won't be in the model because coming from the user)
  percentFollowed: number;
  // LAst time the user did something in this part (won't be in the model because coming from the user)
  lastDone: Date;

  // Count of the user actions (won't be in the model because coming from the user)
  countParagraph :number;
  countRead :number;
  countCheckOk: number;
  countCheckKo: number;


  constructor(document: {}) {
    _.merge(this, document);
  }

}


/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
export var schemaCoursePart: Mongoose.Schema = new Mongoose.Schema();
schemaCoursePart.add({
  title: {
    type: String,
    require: true
  },
  parts: [schemaCoursePart],
  contents: [schemaParagraph]
});

