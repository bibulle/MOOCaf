import * as _ from "lodash";
import Mongoose = require("mongoose");
import {ICoursePart, schemaCoursePart} from "./iCoursePart";
//var Schema = Mongoose.Schema;
var debug = require('debug')('server:model:iaward');

export class IAward {

  // The name of the award
  name: string;

  // The description of the award
  description: string;

  // The level (0: bronze, 1: silver, 2:gold, 3:platinum, ....)
  level: number;

  // The path to the badge
  imgPath: string;

  // Is it a secret (should display a lock until you get it)
  secret: boolean;

  // How many things are needed to get the award ?
  limitCount: number;

  // How many yhe user get (not in the Db, added later)
  userCount?: number;

  created: Date;
  updated: Date;

  /**
   * Constructor
   * @param mongoose.Document<ICourse>
   */
  constructor(document: {}) {
    _.merge(this, document);
  }
}

interface IAwardModel extends IAward, Mongoose.Document {
}


/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
var _schema: Mongoose.Schema = new Mongoose.Schema({
    name: {
      type: String,
      require: true
    },
    description: {
      type: String,
      require: true
    },
    level: {
      type: Number,
      require: true
    },
    imgPath: {
      type: String,
      require: true
    },
    secret: {
      type: Boolean,
      default: false
    },
    limitCount: {
      type: Number,
      default: 1
    },
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    }
  })
    .pre('save', function (next) {
      this.updated = new Date();
      next();
    })
  ;


/**
 * Mongoose.Model
 * @type {Model<IParagraphModel>}
 * @private
 */
export var modelIAward = Mongoose.model < IAwardModel >('Award', _schema);


