import {ParagraphContentType} from "./eParagraphContentType";
import {ParagraphType} from "./eParagraphType";
import {IParagraphContent} from "./iParagraphContent";
import * as _ from 'lodash';
import Mongoose = require("mongoose");
import db from "./db";
var debug = require('debug')('server:model:paragraph');

class IParagraph {
  // The type
  type: ParagraphType;

  // The markdown rawContent
  public content: IParagraphContent[] = [];

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
   * @param document
   */
  constructor(document: {}) {
    _.merge(this, document);

    if (!this.content) {
      this.content = [];
    }

  }
}

interface IParagraphModel extends IParagraph, Mongoose.Document {
}


//noinspection TypeScriptUnresolvedVariable
/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
var _schema: Mongoose.Schema = new Mongoose.Schema({
    type: {
      type: ParagraphType,
      require: true
    },
    content: {
      type: [],
      'default': []
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

  })
    .pre('save', function (next) {
      console.log("pre save");
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
var _model = Mongoose.model < IParagraphModel >('Paragraph', _schema);

class Paragraph extends IParagraph {

  /**
   * Constructor
   * @param document
   */
  constructor(document: {}) {
    super(document);
    _model.on('error', function(err) {
      debug("Error : "+err);
    });
  }


  static count(): Promise<number> {
    debug("count");
    return new Promise<number>((resolve, reject) => {
      _model.count(
        {},
        (err, count) => {
          //debug("count " + err + " " + count);
          if (err) {
            db.init();
            this.count()
              .then(result => resolve(result))
              .catch(err => reject(err))
          } else {
            resolve(count);
          }
        });
    })
  };

  static find(): Promise < Paragraph[] > {
    debug("find");
    return new Promise < IParagraph[] >((resolve, reject) => {
      _model.find({})
        .exec()
        .then(
          paragraphs => {
            debug("find then");
            resolve(paragraphs);
          },
          err => {
            debug("find " + err);
            db.init();
            this.find()
              .then(result => resolve(result))
              .catch(err => reject(err))
          })
        ;
    })
  }

  static findById(id: string): Promise < Paragraph > {
    return new Promise < IParagraph >((resolve, reject) => {
      _model.findById(id)
        .exec()
        .then(
          paragraph => {
            resolve(paragraph);
          },
          err => {
            reject(err);
          });
    })
  }

  static updateOrCreate(paragraph: Paragraph): Promise < Paragraph > {
    return new Promise < IParagraph >((resolve, reject) => {

      debug("updateOrCreate id:" + paragraph["_id"]);
      if (paragraph["_id"]) {
        paragraph.updated = new Date();
        _model.findByIdAndUpdate(paragraph["_id"], paragraph)
          .exec()
          .then(
            paragraph => {
              resolve(paragraph);
            },
            err => {
              reject(err);
            });
      } else {
        _model.create(paragraph)
          .then(
            paragraph => {
              resolve(paragraph);
            },
            err => {
              reject(err);
            });
      }

    })
  }


}

export = Paragraph


