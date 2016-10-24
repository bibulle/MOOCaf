"use strict";
const Mongoose = require("mongoose");
const _ = require("lodash");
const eParagraphType_1 = require("./eParagraphType");
const iParagraphContent_1 = require("./iParagraphContent");
var debug = require('debug')('server:model:paragraph');
class IParagraph {
    /**
     * Constructor
     * @param any
     */
    constructor(document) {
        // The markdown rawContent
        this.content = new iParagraphContent_1.IParagraphContent();
        _.merge(this, document);
        if (this.content == null) {
            this.content = new iParagraphContent_1.IParagraphContent();
        }
        //debug(this);
    }
}
exports.IParagraph = IParagraph;
/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
exports.schemaParagraph = new Mongoose.Schema();
exports.schemaParagraph.add({
    type: {
        type: eParagraphType_1.ParagraphType,
        require: true
    },
    content: {
        type: Mongoose.Schema.Types.Mixed,
        default: new iParagraphContent_1.IParagraphContent()
    },
    answer: {
        type: Mongoose.Schema.Types.Mixed,
        require: false
    },
    maxCheckCount: {
        type: Number,
        require: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});
//# sourceMappingURL=iParagraph.js.map