"use strict";
const eParagraphContentType_1 = require("./eParagraphContentType");
const eParagraphType_1 = require("./eParagraphType");
const _ = require('lodash');
const Mongoose = require("mongoose");
const db_1 = require("./db");
var debug = require('debug')('server:model:paragraph');
class IParagraph {
    /**
     * Constructor
     * @param mongoose.Document<IUser>
     */
    constructor(document) {
        // The markdown rawContent
        this.content = new Array();
        _.merge(this, document);
        if (!this.content) {
            this.content = new Array();
        }
    }
}
/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
var _schema = new Mongoose.Schema({
    type: {
        type: eParagraphType_1.ParagraphType,
        require: true
    },
    content: {
        type: [],
        default: new Array()
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
})
    .pre('save', function (next) {
    console.log("pre save");
    this.updated = new Date();
    next();
});
/**
 * Mongoose.Model
 * @type {Model<IParagraphModel>}
 * @private
 */
var _model = Mongoose.model('Paragraph', _schema);
class Paragraph extends IParagraph {
    /**
     * Constructor
     * @param mongoose.Document<IUser>
     */
    constructor(document) {
        super(document);
        _model.on('error', function (err) {
            debug("Error : " + err);
        });
    }
    static count() {
        debug("count");
        return new Promise((resolve, reject) => {
            _model.count({}, (err, count) => {
                //debug("count " + err + " " + count);
                if (err) {
                    db_1.default.init();
                    this.count()
                        .then(result => resolve(result))
                        .catch(err => reject(err));
                }
                else {
                    resolve(count);
                }
            });
        });
    }
    ;
    static find() {
        debug("find");
        return new Promise((resolve, reject) => {
            _model.find({})
                .exec()
                .then(paragraphs => {
                debug("find then");
                resolve(paragraphs);
            }, err => {
                debug("find " + err);
                db_1.default.init();
                this.find()
                    .then(result => resolve(result))
                    .catch(err => reject(err));
            });
        });
    }
    static findById(id) {
        return new Promise((resolve, reject) => {
            _model.findById(id)
                .exec()
                .then(paragraph => {
                resolve(paragraph);
            }, err => {
                reject(err);
            });
        });
    }
    static updateOrCreate(paragraph) {
        return new Promise((resolve, reject) => {
            debug("updateOrCreate id:" + paragraph["_id"]);
            if (paragraph["_id"]) {
                paragraph.updated = new Date();
                _model.findByIdAndUpdate(paragraph["_id"], paragraph)
                    .exec()
                    .then(paragraph => {
                    resolve(paragraph);
                }, err => {
                    reject(err);
                });
            }
            else {
                _model.create(paragraph)
                    .then(paragraph => {
                    resolve(paragraph);
                }, err => {
                    reject(err);
                });
            }
        });
    }
}
// Init database if it's empty
Paragraph.count()
    .then(count => {
    //debug("init then");
    if (count === 0) {
        var paragraphs = [
            new Paragraph({
                type: eParagraphType_1.ParagraphType.MarkDown,
                content: [
                    '*quelques mots* ou  _quelques mots_\n\n**plus important** ou __également important__',
                    'Mon texte `code` fin de mon texte',
                    '    Première ligne de code\n    Deuxième ligne',
                    '> Ce texte apparaîtra dans un élément HTML blockquote.',
                    '* Pommes\n* Poires\n    * Sous élément avec au moins quatre espaces devant.',
                    '1. mon premier\n2. mon deuxième',
                    '# un titre de premier niveau\n#### un titre de quatrième niveau\n\n',
                    'Titre de niveau 1\n=====================\n\nTitre de niveau 2\n--------------------'
                ]
            }),
            new Paragraph({
                type: eParagraphType_1.ParagraphType.MarkDown,
                content: [
                    '+	this is a list item\nindented with tabs\n\n' +
                        '+   this is a list item\n' +
                        'indented with spaces\n\n' +
                        'Code:\n\n	this code block is indented by one tab\n\n' +
                        'And: \n\n		this code block is indented by two tabs\n\n' +
                        'And: \n\n+	this is an example list item\n		indented with tabs\n\n' +
                        '+   this is an example list item\n	    indented with spaces'
                ]
            }),
            new Paragraph({
                type: eParagraphType_1.ParagraphType.MarkDown,
                content: [
                    '\`\`\`javascript\n  var s = "JavaScript syntax highlighting";\n  alert(s);\n\`\`\`',
                    '\`\`\`python\n  s = "Python syntax highlighting"\n  print s\n\`\`\`',
                    '\`\`\`\n  No language indicated, so no syntax highlighting.\n  But let\'s throw in a <b>tag</b>.\n\`\`\`'
                ]
            }),
            new Paragraph({
                type: eParagraphType_1.ParagraphType.Form,
                content: [
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Label,
                        label: 'This is the title of the question'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Radio,
                        name: 'F239712893F323AB35',
                        label: 'Is response **True** ?\n\nSecond line',
                        value: '1'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Radio,
                        name: 'F239712893F323AB35',
                        label: 'Is response **False** ?',
                        value: '2'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Radio,
                        name: 'F239712893F323AB35',
                        label: 'Or **Neither**',
                        value: '3'
                    },
                ],
                userChoice: undefined,
                userCheckOK: undefined,
                userCheckCount: 0,
                maxCheckCount: 2
            }),
            new Paragraph({
                type: eParagraphType_1.ParagraphType.Form,
                content: [
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Label,
                        label: 'This is the title of the question'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Checkbox,
                        name: 'FC56E98',
                        label: 'Is response **True** ?\n\nSecond line',
                        value: '1'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Checkbox,
                        name: 'FC56E98',
                        label: 'Is response **False** ?',
                        value: '2'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Checkbox,
                        name: 'FC56E98',
                        label: 'Or **Neither**',
                        value: '3'
                    },
                ],
                userChoice: undefined,
                userCheckOK: undefined,
                userCheckCount: 0,
                maxCheckCount: 3
            }),
            new Paragraph({
                type: eParagraphType_1.ParagraphType.Form,
                content: [
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Label,
                        label: 'This is the title of the question'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Text,
                        name: 'fec4637',
                        label: 'What do you think ?\n\nSecond line',
                        size: 20
                    },
                ],
                userChoice: undefined,
                userCheckOK: undefined,
                userCheckCount: 0,
                maxCheckCount: 3
            }),
            new Paragraph({
                type: eParagraphType_1.ParagraphType.Form,
                content: [
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Label,
                        label: 'This is the title of the question'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Radio,
                        name: 'F239712893F323AB35',
                        label: 'Is response **True** ?\n\nSecond line',
                        value: '1'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Radio,
                        name: 'F239712893F323AB35',
                        label: 'Is response **False** ?',
                        value: '2'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Radio,
                        name: 'F239712893F323AB35',
                        label: 'Or **Neither**',
                        value: '3'
                    },
                ],
                userChoice: 2,
                userCheckOK: false,
                userCheckCount: 2,
                maxCheckCount: 2,
                answer: 1
            }),
            new Paragraph({
                type: eParagraphType_1.ParagraphType.Form,
                content: [
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Label,
                        label: 'This is the title of the question'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Checkbox,
                        name: 'FC56E98',
                        label: 'Is response **True** ?\n\nSecond line',
                        value: '1'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Checkbox,
                        name: 'FC56E98',
                        label: 'Is response **False** ?',
                        value: '2'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Checkbox,
                        name: 'FC56E98',
                        label: 'Or **Neither**',
                        value: '3'
                    },
                ],
                userChoice: ['1', '2'],
                userCheckOK: false,
                userCheckCount: 3,
                maxCheckCount: 3,
                answer: ['1', '3']
            }),
            new Paragraph({
                type: eParagraphType_1.ParagraphType.Form,
                content: [
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Label,
                        label: 'This is the title of the question'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Text,
                        name: 'fec4637',
                        label: 'What do you think ?\n\nSecond line',
                        size: 20
                    },
                ],
                userChoice: 'rgeg',
                userCheckOK: false,
                userCheckCount: 3,
                maxCheckCount: 3,
                answer: 'sdkfsd sdg'
            }),
            new Paragraph({
                type: eParagraphType_1.ParagraphType.Form,
                content: [
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Label,
                        label: 'This is the title of the question'
                    },
                    {
                        type: eParagraphContentType_1.ParagraphContentType.Text,
                        name: 'fec4637',
                        label: 'What do you think ?',
                        size: 20
                    },
                ],
                userChoice: 'rgeg',
                userCheckOK: false,
                userCheckCount: 3,
                maxCheckCount: 3,
                answer: 'sdkfsd sdg'
            }),
        ];
        _.forEach(paragraphs, o => {
            //var paragraph = new Paragraph(o);
            Paragraph.updateOrCreate(o)
                .then(paragraph => debug("Paragraph created : " + JSON.stringify(paragraph)))
                .catch(err => debug("Error creating user : " + err));
        });
    }
})
    .catch(err => {
    debug("init catch");
    console.log(err);
});
module.exports = Paragraph;
//# sourceMappingURL=paragraph.js.map