"use strict";
const Mongoose = require("mongoose");
const _ = require("lodash");
const iParagraph_1 = require("./iParagraph");
var debug = require('debug')('server:model:course-part');
class ICoursePart {
    constructor(document) {
        _.merge(this, document);
    }
}
exports.ICoursePart = ICoursePart;
/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
exports.schemaCoursePart = new Mongoose.Schema();
exports.schemaCoursePart.add({
    title: {
        type: String,
        require: true
    },
    parts: [exports.schemaCoursePart],
    contents: [iParagraph_1.schemaParagraph]
});
//# sourceMappingURL=iCoursePart.js.map