import Mongoose = require("mongoose");
import * as _ from 'lodash';
import { StatKey } from "./eStatKey";

var debug = require('debug')('server:model:user-stats');

class IUserStats {

  userId: string;
  statKey: StatKey;

  userCount: number;

  /**
   * Constructor
   * @param document
   */
  constructor(document: {}) {
    _.merge(this, document);
  }
}

interface IUserStatsModel extends IUserStats, Mongoose.Document {
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
  statKey: {
    type: String,
    require: true
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
    this.updated = new Date();
    next();
  });

/**
 * Mongoose.Model
 * @type {Model<IUser>}
 * @private
 */
var _model = Mongoose.model < IUserStatsModel >('UserStats', _schema);

class UserStats extends IUserStats {

  /**
   * Constructor
   * @param document
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

  static findByUserId(userId: string): Promise < { [id: string]: UserStats } > {
    return new Promise < { [id: string]: UserStats } >((resolve, reject) => {
      _model.find({userId: userId})
            .lean()
            .exec()
            .then(
              (userStats: UserStats[]) => {
                var result = {};

                userStats.forEach(uc => {
                  uc['id'] = uc['_id'].toString();

                  result[uc.statKey.toString()] = uc;
                });

                resolve(result);
              },
              err => {
                reject(err);
              });
    })
  }

  static findByUserIdStatKey(userId: string, statKey: string): Promise < UserStats > {
    return new Promise < IUserStats >((resolve, reject) => {
      _model.findOne({userId: userId, statKey: statKey})
            .lean()
            .exec()
            .then(
              (user: IUserStats) => {
                //debug(user);
                if (user) {
                  user['id'] = user['_id'].toString();
                }
                resolve(user);
              },
              err => {
                reject(err);
              });
    })
  }

  static updateOrCreate(userStat: UserStats): Promise < UserStats > {
    return new Promise<IUserStats>((resolve, reject) => {
      var obj = {};
      _.assign(obj, userStat);
      _model.findOneAndUpdate(
        {userId: userStat.userId, statKey: userStat.statKey},
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


export = UserStats;
