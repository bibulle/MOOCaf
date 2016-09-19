import * as _ from "lodash";
import db from "./db";
import Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var debug = require('debug')('server:model:formation');

class IFormation {

  // The name of the formation
  name: string;

  // The description
  description: string;

  // The average note (choosen by the users)
  note: number;
  // The note count (to add a new note to the average)
  noteCount: number;

  // Is it favorite of the user (won't be in the model because coming from the user)
  isFavorite: boolean;

  // Is this interresting for the user between 0 and 1 (won't be in the model because coming from the user)
  interest: number;

  // When the user start and end the course (won't be in the model because coming from the user)
  dateFollowed: Date;
  dateFollowedEnd: Date;

  // Percentage he already followed (won't be in the model because coming from the user)
  percentFollowed: number;

  created: Date;
  updated: Date;


  /**
   * Constructor
   * @param mongoose.Document<IFormation>
   */
  constructor(document: {}) {
    _.merge(this, document);
  }
}

interface IFormationModel extends IFormation, Mongoose.Document {
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
    }

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
var _model = Mongoose.model < IFormationModel >('Formation', _schema);

class Formation extends IFormation {

  /**
   * Constructor
   * @param mongoose.Document<IFormation>
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

  static find(): Promise < Formation[] > {
    // debug("find");
    return new Promise < IFormation[] >((resolve, reject) => {
      _model.find({})
        .exec()
        .then(
          formations => {
            // debug("find then");
            resolve(formations);
          },
          err => {
            // debug("find " + err);
            db.init();
            this.find()
              .then(result => resolve(result))
              .catch(err => reject(err))
          })
        ;
    })
  }

  static findById(id: string): Promise < Formation > {
    return new Promise < IFormation >((resolve, reject) => {
      _model.findById(id)
        .exec()
        .then(
          formation => {
            resolve(formation);
          },
          err => {
            reject(err);
          });
    })
  }

  static updateOrCreate(formation: Formation): Promise < Formation > {
    return new Promise < IFormation >((resolve, reject) => {

      // debug("updateOrCreate id:" + formation["_id"]);
      if (formation["_id"]) {
        formation.updated = new Date();
        _model.findByIdAndUpdate(formation["_id"], formation)
          .exec()
          .then(
            paragraph => {
              resolve(paragraph);
            },
            err => {
              reject(err);
            });
      } else {
        _model.create(formation)
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

export = Formation


// Init database if it's empty
Formation.count()
  .then(count => {
    //debug("init then");
    if (count === 0) {
      var formations: {}[] = [
          {
            name: "Starting a project with Big Data",
            description: "A simple MOOC to learn how to start a Big Data project",
            note: 3.5,
            noteCount: 4,
            created: new Date('2016-08-12T00:00:00'),
            updated: new Date('2016-08-12T00:10:00'),
          },
          {
            name: "What's new in JDK8",
            description: "Just learn to use JDK8 new features",
            note: 4.0,
            noteCount: 2,
            created: new Date('2016-08-18T00:00:00'),
            updated: new Date('2016-08-18T00:00:00'),
          },
          {
            name: "Learning machine learning with Spark",
            description: "A simple introduction to Machine Learning with Spark ML",
            note: 2.0,
            noteCount: 2,
            created: new Date('2016-09-01T00:00:00'),
            updated: new Date('2016-09-01T00:00:00'),
          },
          {
            name: "Is JDK9 going to break my project",
            description: "What's new in JDK9",
            note: 4.5,
            noteCount: 2,
            created: new Date('2016-08-26T00:00:00'),
            updated: new Date('2016-08-26T00:00:00'),
          },
          {
            name: "Using DevNet",
            description: "A MOOC to learn using DevNet",
            note: 5.0,
            noteCount: 2,
            created: new Date('2016-08-12T00:00:00'),
            updated: new Date('2016-08-12T00:00:00'),
          },
          {
            name: "MongoDb at a glance",
            description: "What are the essentials to start with mongoDb",
            note: 4.5,
            noteCount: 2,
            created: new Date('2016-07-14T00:00:00'),
            updated: new Date('2016-07-14T00:00:00'),
          },
          {
            name: "Spring Boot",
            description: "WTF",
            note: 2.5,
            noteCount: 2,
            created: new Date('2016-10-28T00:00:00'),
            updated: new Date('2016-10-28T00:00:00'),
          },
        ];

      _.forEach(formations,
        o => {
          var formation = new Formation(o);
          Formation.updateOrCreate(formation)
            .then(formation => debug("Formation created : " + JSON.stringify(formation)))
            .catch(err => debug("Error creating formation : " + err))
        });
    }
  })
  .catch(err => {
    debug("init catch");
    console.log(err);
  });


