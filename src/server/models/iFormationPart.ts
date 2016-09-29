import Mongoose = require("mongoose");
import {IParagraph, schemaParagraph} from "./iParagraph";
//var Schema = Mongoose.Schema;
var debug = require('debug')('server:model:formation');

export class IFormationPart {
  title: String;
  parts: IFormationPart[];
  contents: IParagraph[]
}

/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
export var schemaFormationPart: Mongoose.Schema = new Mongoose.Schema();
schemaFormationPart.add({
  title: {
    type: String,
    require: true
  },
  parts: [schemaFormationPart],
  contents: [schemaParagraph]
});

