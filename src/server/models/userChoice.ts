import Mongoose = require("mongoose");
import * as _ from 'lodash';

var debug = require('debug')('server:model:userChoice');


class IUserChoice {
  paragraphId: string;
  userId: string;
  userCheckCount: number;
  userCheckOK: boolean;
  userChoice: any;
  created: Date;
  updated: Date;

  /**
   * Constructor
   * @param mongoose.Document<IUserChoice>
   */
  constructor(document: {}) {
    _.merge(this, document);
  }
}

interface IUserChoiceModel extends IUserChoice, Mongoose.Document {
}

/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
var _schema: Mongoose.Schema = new Mongoose.Schema({
  paragraphId: {
    type: String,
    require: true
  },
  userId: {
    type: String,
    require: true
  },
  userCheckCount: {
    type: Number,
    default: 0
  },
  userCheckOK: {
    type: Boolean,
    default: null
  },
  userChoice: {
    type: Mongoose.Schema.Types.Mixed,
    require: true
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
  });

/**
 * Mongoose.Model
 * @type {Model<IUserChoice>}
 * @private
 */
var _model = Mongoose.model < IUserChoiceModel >('UserChoice', _schema);

class UserChoice extends IUserChoice {

  /**
   * Constructor
   * @param mongoose.Document<IUser>
   */
  constructor(document: {}) {
    super(document);
  }

  static count(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      _model.count(
        {},
        (err, count) => {
          err ? reject(err) : resolve(count);
        });
    })
  };

  static findById(id: string): Promise < UserChoice > {
    return new Promise < IUserChoice >((resolve, reject) => {
      _model.findById(id)
        .exec()
        .onResolve((err, userChoice) => {
          err ? reject(err) : resolve(userChoice);
        });
    })
  }

  static findByParaAndUser(paragraphId: string, userId: string): Promise < UserChoice > {
    return new Promise < IUserChoice >((resolve, reject) => {
      _model.findOne({paragraphId: paragraphId, userId: userId})
        .exec()
        .then(
          userChoice => {
            resolve(userChoice);
          },
          err => {
            reject(err);
          });
    })
  }

  static updateOrCreate(userChoice: UserChoice): Promise < UserChoice > {
    return new Promise < IUserChoice >((resolve, reject) => {

      debug("updateOrCreate ids:" + userChoice.paragraphId + ", " + userChoice.userId);

      userChoice.updated = new Date();
      _model.update(
        {paragraphId: userChoice.paragraphId, userId: userChoice.userId},
        userChoice,
        {upsert: true, setDefaultsOnInsert: true})
        .exec()
        .then(
          userChoice => {
            resolve(userChoice);
          },
          err => {
            reject(err);
          });

    })
  }


}

export = UserChoice

