import Mongoose = require("mongoose");
import {IParagraph, schemaParagraph} from "./iParagraph";
//var Schema = Mongoose.Schema;
var debug = require('debug')('server:model:coursepart');

export class ICoursePart {
  title: String;
  parts: ICoursePart[];
  contents: IParagraph[]
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

