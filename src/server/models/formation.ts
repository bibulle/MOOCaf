import * as _ from "lodash";
import db from "./db";
import {ParagraphType} from "./eParagraphType";
import {ParagraphContentType} from "./eParagraphContentType";
import {IFormation, modelIFormation} from "./iFormation";
import Mongoose = require("mongoose");
import {IParagraph} from "./iParagraph";
var Schema = Mongoose.Schema;
var debug = require('debug')('server:model:formation');

export default class Formation extends IFormation {

  /**
   * Constructor
   * @param mongoose.Document<IFormation>
   */
  constructor(document: {}) {
    super(document);
    modelIFormation.on('error', function (err) {
      debug("Error : " + err);
    });
  }


  static count(): Promise<number> {
    debug("count");
    return new Promise<number>((resolve, reject) => {
      modelIFormation.count(
        {},
        (err, count) => {
          //debug("count " + err + " " + count);
          if (err) {
            db.init();
            this.count()
              .then(result => resolve(result))
              .catch(err => reject(err))
          } else {
            resolve(count);
          }
        });
    })
  };

  /**
   * Find the list of formations
   * @returns {Promise<IFormation[]>}
   */
  static find(): Promise < Formation[] > {
    // debug("find");
    return new Promise < IFormation[] >((resolve, reject) => {

      // Do the search
      modelIFormation.find({})
        .exec()
        .then(
          formations => {
            // debug("find then");
            resolve(formations);
          },
          err => {
            // debug("find " + err);
            db.init();
            this.find()
              .then(result => resolve(result))
              .catch(err => reject(err))
          })
      ;
    })
  }

  static findById(id: string): Promise < Formation > {
    return new Promise < IFormation >((resolve, reject) => {
      modelIFormation.findById(id)
        .exec()
        .then(
          formation => {
            debug(formation);
            resolve(formation);
          },
          err => {
            reject(err);
          });
    })
  }

  static updateOrCreate(formation: Formation): Promise < Formation > {
    return new Promise < IFormation >((resolve, reject) => {

      // debug("updateOrCreate id:" + formation["_id"]);
      if (formation["_id"]) {
        formation.updated = new Date();
        modelIFormation.findByIdAndUpdate(formation["_id"], formation)
          .exec()
          .then(
            paragraph => {
              resolve(paragraph);
            },
            err => {
              reject(err);
            });
      } else {
        modelIFormation.create(formation)
          .then(
            paragraph => {
              resolve(paragraph);
            },
            err => {
              reject(err);
            });
      }

    })
  }


}


// Init database if it's empty
Formation.count()
  .then(count => {
    debug("init then");
    if (count === 0) {
      var formations: {}[] = [
        {
          name: "Starting a project with Big Data",
          description: "A simple MOOC to learn how to start a Big Data project",
          note: 3.5,
          noteCount: 4,
          created: new Date('2016-08-12T00:00:00'),
          updated: new Date('2016-08-12T00:10:00'),
          parts: [
          {
            title: "Week 1 : Big Data, how it works ?",
            parts: [
              {
                title: "What is Big Data ? (from business point of view)",
                parts: null,
                contents: [

                  new IParagraph({
                      type: ParagraphType.MarkDown,
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
                    }
                  ),
                  new IParagraph({
                      type: ParagraphType.MarkDown,
                      content: [
                        '+	this is a list item\nindented with tabs\n\n' +
                        '+   this is a list item\n' +
                        'indented with spaces\n\n' +
                        'Code:\n\n	this code block is indented by one tab\n\n' +
                        'And: \n\n		this code block is indented by two tabs\n\n' +
                        'And: \n\n+	this is an example list item\n		indented with tabs\n\n' +
                        '+   this is an example list item\n	    indented with spaces'
                      ]
                    }
                  ),
                  new IParagraph({
                      type: ParagraphType.MarkDown,
                      content: [
                        '\`\`\`javascript\n  var s = "JavaScript syntax highlighting";\n  alert(s);\n\`\`\`',
                        '\`\`\`python\n  s = "Python syntax highlighting"\n  print s\n\`\`\`',
                        '\`\`\`\n  No language indicated, so no syntax highlighting.\n  But let\'s throw in a <b>tag</b>.\n\`\`\`'
                      ]
                    }
                  ),
                  new IParagraph({
                      type: ParagraphType.Form,
                      content: [
                        {
                          type: ParagraphContentType.Label,
                          label: 'This is the title of the question'
                        },
                        {
                          type: ParagraphContentType.Radio,
                          name: 'F239712893F323AB35',
                          label: 'Is response **True** ?\n\nSecond line',
                          value: '1'
                        },
                        {
                          type: ParagraphContentType.Radio,
                          name: 'F239712893F323AB35',
                          label: 'Is response **False** ?',
                          value: '2'
                        },
                        {
                          type: ParagraphContentType.Radio,
                          name: 'F239712893F323AB35',
                          label: 'Or **Neither**',
                          value: '3'
                        },
                      ],
                      userChoice: undefined,
                      userCheckOK: undefined,
                      userCheckCount: 0,
                      maxCheckCount: 2
                    }
                  ),
                  new IParagraph({
                      type: ParagraphType.Form,
                      content: [
                        {
                          type: ParagraphContentType.Label,
                          label: 'This is the title of the question'
                        },
                        {
                          type: ParagraphContentType.Checkbox,
                          name: 'FC56E98',
                          label: 'Is response **True** ?\n\nSecond line',
                          value: '1'
                        },
                        {
                          type: ParagraphContentType.Checkbox,
                          name: 'FC56E98',
                          label: 'Is response **False** ?',
                          value: '2'
                        },
                        {
                          type: ParagraphContentType.Checkbox,
                          name: 'FC56E98',
                          label: 'Or **Neither**',
                          value: '3'
                        },
                      ],
                      userChoice: undefined,
                      userCheckOK: undefined,
                      userCheckCount: 0,
                      maxCheckCount: 3
                    }
                  ),
                  new IParagraph({
                      type: ParagraphType.Form,
                      content: [
                        {
                          type: ParagraphContentType.Label,
                          label: 'This is the title of the question'
                        },
                        {
                          type: ParagraphContentType.Text,
                          name: 'fec4637',
                          label: 'What do you think ?\n\nSecond line',
                          size: 20
                        },
                      ],
                      userChoice: undefined,
                      userCheckOK: undefined,
                      userCheckCount: 0,
                      maxCheckCount: 3
                    }
                  ),
                  new IParagraph({
                      type: ParagraphType.Form,
                      content: [
                        {
                          type: ParagraphContentType.Label,
                          label: 'This is the title of the question'
                        },
                        {
                          type: ParagraphContentType.Radio,
                          name: 'F239712893F323AB35',
                          label: 'Is response **True** ?\n\nSecond line',
                          value: '1'
                        },
                        {
                          type: ParagraphContentType.Radio,
                          name: 'F239712893F323AB35',
                          label: 'Is response **False** ?',
                          value: '2'
                        },
                        {
                          type: ParagraphContentType.Radio,
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
                    }
                  ),
                  new IParagraph({
                      type: ParagraphType.Form,
                      content: [
                        {
                          type: ParagraphContentType.Label,
                          label: 'This is the title of the question'
                        },
                        {
                          type: ParagraphContentType.Checkbox,
                          name: 'FC56E98',
                          label: 'Is response **True** ?\n\nSecond line',
                          value: '1'
                        },
                        {
                          type: ParagraphContentType.Checkbox,
                          name: 'FC56E98',
                          label: 'Is response **False** ?',
                          value: '2'
                        },
                        {
                          type: ParagraphContentType.Checkbox,
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
                    }
                  ),
                  new IParagraph({
                      type: ParagraphType.Form,
                      content: [
                        {
                          type: ParagraphContentType.Label,
                          label: 'This is the title of the question'
                        },
                        {
                          type: ParagraphContentType.Text,
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
                    }
                  ),
                  new IParagraph({
                      type: ParagraphType.Form,
                      content: [
                        {
                          type: ParagraphContentType.Label,
                          label: 'This is the title of the question'
                        },
                        {
                          type: ParagraphContentType.Text,
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
                    }
                  ),
                ]
              },
              {
                title: "What is Big Data ? (from developer point of view)",
                parts: [],
                contents: null
              },

            ],
            contents: null
          },
          {
            title: "Week 2 : Let's try something",
            parts: [
              {
                title: "Prerequisite : A little bit of unix",
                parts: null,
                contents: null
              },
              {
                title: "Let's code",
                parts: null,
                contents: null
              },
            ],
            contents: null
          },
          {
            title: "Week 3 : A little bit deeper",
            parts: null,
            contents: null
          },
        ]
        },
        {
          name: "What's new in JDK8",
          description: "Just learn to use JDK8 new features",
          note: 4.0,
          noteCount: 2,
          created: new Date('2016-08-18T00:00:00'),
          updated: new Date('2016-08-18T00:00:00'),
        },
        {
          name: "Learning machine learning with Spark",
          description: "A simple introduction to Machine Learning with Spark ML",
          note: 2.0,
          noteCount: 2,
          created: new Date('2016-09-01T00:00:00'),
          updated: new Date('2016-09-01T00:00:00'),
        },
        {
          name: "Is JDK9 going to break my project",
          description: "What's new in JDK9",
          note: 4.5,
          noteCount: 2,
          created: new Date('2016-08-26T00:00:00'),
          updated: new Date('2016-08-26T00:00:00'),
        },
        {
          name: "Using DevNet",
          description: "A MOOC to learn using DevNet",
          note: 5.0,
          noteCount: 2,
          created: new Date('2016-08-12T00:00:00'),
          updated: new Date('2016-08-12T00:00:00'),
        },
        {
          name: "MongoDb at a glance",
          description: "What are the essentials to start with mongoDb",
          note: 4.5,
          noteCount: 2,
          created: new Date('2016-07-14T00:00:00'),
          updated: new Date('2016-07-14T00:00:00'),
        },
        {
          name: "Spring Boot",
          description: "WTF",
          note: 2.5,
          noteCount: 2,
          created: new Date('2016-10-28T00:00:00'),
          updated: new Date('2016-10-28T00:00:00'),
        },
      ];

      _.forEach(formations,
        o => {
          var formation = new Formation(o);
          Formation.updateOrCreate(formation)
            .then(formation => debug("Formation created : " + JSON.stringify(formation)))
            .catch(err => debug("Error creating formation : " + err))
        });
    }
  })
  .catch(err => {
    debug("init catch");
    console.log(err);
  });


