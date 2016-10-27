import * as _ from "lodash";
import Mongoose = require("mongoose");
import {ICoursePart, schemaCoursePart} from "./iCoursePart";
//var Schema = Mongoose.Schema;
var debug = require('debug')('server:model:course');

export class ICourse {

  // The name of the course
  name: string;

  // The description
  description: string;

  // The publish date
  publishDate: Date;


  // The average note (choosen by the users)
  note: number;
  // The note count (to add a new note to the average)
  noteCount: number;

  // Is it favorite of the user (won't be in the model because coming from the user)
  isFavorite: boolean;

  // Is this interesting for the user between 0 and 1 (won't be in the model because coming from the user)
  interest: number;

  // When the user start and end the course (won't be in the model because coming from the user)
  dateFollowed: Date;
  dateFollowedEnd: Date;

  // Percentage he already followed (won't be in the model because coming from the user)
  percentFollowed: number;

  created: Date;
  updated: Date;

  parts: ICoursePart[];


  /**
   * Constructor
   * @param mongoose.Document<ICourse>
   */
  constructor(document: {}) {
    _.merge(this, document);
  }
}

interface ICourseModel extends ICourse, Mongoose.Document {
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
      require: false
    },
    publishDate: {
      type: Date,
      require: false
    },
    note: {
      type: Number,
      require: false
    },
    noteCount: {
      type: Number,
      default: 0
    },
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    },
    parts: [schemaCoursePart]

  })
    .pre('save', function (next) {
      //console.log("pre save");
      this.updated = new Date();
      next();
    })
  // .post('init', function (doc) {
  //   console.log('%s has been initialized from the db', doc['_id']);
  // })
  // .post('count', function (doc) {
  //   console.log('%s has been initialized from the db', doc['_id']);
  // })
  // .post('validate', function (doc) {
  //   console.log('%s has been validated (but not saved yet)', doc['_id']);
  // })
  // .post('save', function (doc) {
  //   console.log('%s has been saved', doc['_id']);
  // })
  // .post('remove', function (doc) {
  //   console.log('%s has been removed', doc['_id']);
  // })
  ;


/**
 * Mongoose.Model
 * @type {Model<IParagraphModel>}
 * @private
 */
export var modelICourse = Mongoose.model < ICourseModel >('Course', _schema);


