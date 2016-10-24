"use strict";
const Mongoose = require("mongoose");
const _ = require('lodash');
var Schema = Mongoose.Schema;
var debug = require('debug')('server:model:user-course');
class IUserCourse {
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
    isFavorite: {
        type: Boolean,
        'default': false
    },
    interest: {
        type: Number,
        'default': 0
    },
    dateSeen: {
        type: Date,
        'default': null
    },
    'new': {
        type: Boolean,
        'default': true
    },
    dateFollowed: {
        type: Date,
        'default': null
    },
    dateFollowedEnd: {
        type: Date,
        'default': null
    },
    percentFollowed: {
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
    },
    userChoices: {
        type: Schema.Types.Mixed,
        require: false
    },
    userParts: {
        type: Schema.Types.Mixed,
        require: false
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
var _model = Mongoose.model('UserCourse', _schema);
class UserCourse extends IUserCourse {
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
    static findByUserId(userId) {
        return new Promise((resolve, reject) => {
            _model.find({ userId: userId })
                .lean()
                .exec()
                .then((userCourses) => {
                var result = {};
                userCourses.forEach(uc => {
                    uc['id'] = uc['_id'].toString();
                    result[uc.courseId] = uc;
                });
                resolve(result);
            }, err => {
                reject(err);
            });
        });
    }
    static findByUserIdCourseId(userId, courseId) {
        return new Promise((resolve, reject) => {
            _model.findOne({ userId: userId, courseId: courseId })
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
    static updateOrCreate(userCourse) {
        return new Promise((resolve, reject) => {
            var obj = {};
            _.assign(obj, userCourse);
            _model.findOneAndUpdate({ userId: userCourse.userId, courseId: userCourse.courseId }, { $set: obj }, { upsert: true, 'new': true }, 
            //{upsert: true, 'new': true, setDefaultsOnInsert: true},
            function (error, result) {
                if (error) {
                    reject(error);
                }
                else {
                    result = result['_doc'];
                    result['id'] = result._id.toString();
                    resolve(result);
                }
            });
        });
    }
}
module.exports = UserCourse;
//# sourceMappingURL=UserCourse.js.map