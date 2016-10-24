"use strict";
const Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
const _ = require('lodash');
var debug = require('debug')('server:model:userChoice');
class IUserChoice {
    /**
     * Constructor
     * @param mongoose.Document<IUserChoice>
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
        type: Schema.Types.Mixed,
        require: true
    },
    userDone: {
        type: Date,
        default: null
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
var _model = Mongoose.model('UserChoice', _schema);
class UserChoice extends IUserChoice {
    /**
     * Constructor
     * @param mongoose.Document<IUser>
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
    static findById(id) {
        return new Promise((resolve, reject) => {
            _model.findById(id)
                .exec()
                .then((userChoice) => {
                resolve(userChoice);
            })
                .catch(err => {
                reject(err);
            });
        });
    }
    static findByParaAndUser(paragraphId, userId) {
        return new Promise((resolve, reject) => {
            _model.findOne({ paragraphId: paragraphId, userId: userId })
                .exec()
                .then(userChoice => {
                resolve(userChoice);
            }, err => {
                reject(err);
            });
        });
    }
    static updateOrCreate(userChoice) {
        return new Promise((resolve, reject) => {
            debug("updateOrCreate ids:" + userChoice.paragraphId + ", " + userChoice.userId);
            userChoice.updated = new Date();
            _model.update({ paragraphId: userChoice.paragraphId, userId: userChoice.userId }, userChoice, { upsert: true, setDefaultsOnInsert: true })
                .exec()
                .then(userChoice => {
                resolve(userChoice);
            }, err => {
                reject(err);
            });
        });
    }
}
module.exports = UserChoice;
//# sourceMappingURL=userChoice.js.map