"use strict";
const Mongoose = require("mongoose");
const _ = require('lodash');
var debug = require('debug')('server:model:user-stats');
class IUserStats {
    /**
     * Constructor
     * @param document
     */
    constructor(document) {
        _.merge(this, document);
    }
}
/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
var _schema = new Mongoose.Schema({
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
var _model = Mongoose.model('UserStats', _schema);
class UserStats extends IUserStats {
    /**
     * Constructor
     * @param document
     */
    constructor(document) {
        super(document);
    }
    static count() {
        return new Promise((resolve, reject) => {
            _model.count({}, (err, count) => {
                err ? reject(err) : resolve(count);
            });
        });
    }
    ;
    static findByUserId(userId) {
        return new Promise((resolve, reject) => {
            _model.find({ userId: userId })
                .lean()
                .exec()
                .then((userStats) => {
                var result = {};
                userStats.forEach(uc => {
                    uc['id'] = uc['_id'].toString();
                    result[uc.statKey.toString()] = uc;
                });
                resolve(result);
            }, err => {
                reject(err);
            });
        });
    }
    static findByUserIdStatKey(userId, statKey) {
        return new Promise((resolve, reject) => {
            _model.findOne({ userId: userId, statKey: statKey })
                .lean()
                .exec()
                .then((user) => {
                //debug(user);
                if (user) {
                    user['id'] = user['_id'].toString();
                }
                resolve(user);
            }, err => {
                reject(err);
            });
        });
    }
    static updateOrCreate(userStat) {
        return new Promise((resolve, reject) => {
            var obj = {};
            _.assign(obj, userStat);
            _model.findOneAndUpdate({ userId: userStat.userId, statKey: userStat.statKey }, { $set: obj }, { upsert: true, 'new': true }, 
            //{upsert: true, 'new': true, setDefaultsOnInsert: true},
            function (error, result) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
module.exports = UserStats;
//# sourceMappingURL=UserStats.js.map