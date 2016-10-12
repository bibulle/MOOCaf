import Mongoose = require("mongoose");
import * as _ from 'lodash';
var Schema = Mongoose.Schema;

var debug = require('debug')('server:model:user-award');

class IUserAward {

  userId: string;
  awardId: string;

  userCount: number;

  /**
   * Constructor
   * @param document
   */
  constructor(document: {}) {
    _.merge(this, document);
  }
}

interface IUserAwardModel extends IUserAward, Mongoose.Document {
}

/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
var _schema: Mongoose.Schema = new Mongoose.Schema({
  userCount: {
    type: Number,
    'default': 0
  },
  created: {
    type: Date,
    'default': Date.now
  },
  updated: {
    type: Date,
    'default': Date.now
  }})
  .pre('save', function (next) {
    this.updated = new Date();
    next();
  });

/**
 * Mongoose.Model
 * @type {Model<IUser>}
 * @private
 */
var _model = Mongoose.model < IUserAwardModel >('UserAward', _schema);

class UserAward extends IUserAward {

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

  static findByUserId(userId: string): Promise < { [id: string]: UserAward } > {
    return new Promise < { [id: string]: UserAward } >((resolve, reject) => {
      _model.find({userId: userId})
        .lean()
        .exec()
        .then(
          (userAwards: UserAward[]) => {

            var result = {};

            userAwards.forEach(uc => {
              uc['id'] = uc['_id'].toString();

              result[uc.awardId] = uc;
            });

            resolve(result);
          },
          err => {
            reject(err);
          });
    })
  }

  static findByUserIdAwardId(userId: string, awardId: string): Promise < UserAward > {
    return new Promise < IUserAward >((resolve, reject) => {
      _model.findOne({userId: userId, awardId: awardId})
        .lean()
        .exec()
        .then(
          user => {
            //debug(user);
            if (user) {
              user.id = user._id.toString();
            }
            resolve(user);
          },
          err => {
            reject(err);
          });
    })
  }

  static updateOrCreate(userAward: UserAward): Promise < UserAward > {
    return new Promise<IUserAward>((resolve, reject) => {
      var obj = {};
      _.assign(obj, userAward);
      _model.findOneAndUpdate(
        {userId: userAward.userId, awardId: userAward.awardId},
        {$set: obj},
        {upsert: true, 'new': true},
        //{upsert: true, 'new': true, setDefaultsOnInsert: true},
        function (error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
    });
  }

}


export = UserAward;
