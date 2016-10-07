import Mongoose = require("mongoose");
import * as _ from "lodash";

import {IParagraph, schemaParagraph} from "./iParagraph";

var debug = require('debug')('server:model:coursepart');

export class ICoursePart {
  title: String;
  parts: ICoursePart[];
  contents: IParagraph[]



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

