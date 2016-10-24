"use strict";
const _ = require("lodash");
const Mongoose = require("mongoose");
var debug = require('debug')('server:model:iaward');
class IAward {
    /**
     * Constructor
     * @param document
     */
    constructor(document) {
        _.merge(this, document);
    }
}
exports.IAward = IAward;
/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
var _schema = new Mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: false
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
        'default': false
    },
    statKey: {
        type: String,
        require: true
    },
    limitCount: {
        type: Number,
        'default': 1
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
 * @type {Model<IParagraphModel>}
 * @private
 */
exports.modelIAward = Mongoose.model('Award', _schema);
//# sourceMappingURL=iAward.js.map