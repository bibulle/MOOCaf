"use strict";
const _ = require("lodash");
const Mongoose = require("mongoose");
const iCoursePart_1 = require("./iCoursePart");
//var Schema = Mongoose.Schema;
var debug = require('debug')('server:model:course');
class ICourse {
    /**
     * Constructor
     * @param mongoose.Document<ICourse>
     */
    constructor(document) {
        _.merge(this, document);
    }
}
exports.ICourse = ICourse;
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
    parts: [iCoursePart_1.schemaCoursePart]
})
    .pre('save', function (next) {
    //console.log("pre save");
    this.updated = new Date();
    next();
});
/**
 * Mongoose.Model
 * @type {Model<IParagraphModel>}
 * @private
 */
exports.modelICourse = Mongoose.model('Course', _schema);
//# sourceMappingURL=iCourse.js.map