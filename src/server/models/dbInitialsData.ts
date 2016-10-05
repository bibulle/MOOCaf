import Course from "./course";
import {ParagraphType} from "./eParagraphType";
import {IParagraph} from "./iParagraph";
import {ParagraphContentType} from "./eParagraphContentType";
import User = require("./user");
import UserCourse = require("./UserCourse");

var async = require('async');
var debug = require('debug')('server:model:init-db');
import * as _ from 'lodash';


export class DbInitialsData {
  static init() {

    // Init database if it's empty
    async.series([
        function (callback) {
          // ---------------------------
          // Insert course
          // ---------------------------
          Course.count()
            .then(count => {
              if (count === 0) {
                var courses: {}[] = [
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
                                  content: '*few words* or  _few words_\n\n**plus important** ou __également important__\n\n' +
                                  'Mon texte `code` fin de mon texte\n\n' +
                                  '    Première ligne de code\n    Deuxième ligne\n\n' +
                                  '> Ce texte apparaîtra dans un élément HTML blockquote.\n\n' +
                                  '* Pommes\n* Poires\n    * Sous élément avec au moins quatre espaces devant.\n\n' +
                                  '1. mon premier\n2. mon deuxième\n\n' +
                                  '# un titre de premier niveau\n#### un titre de quatrième niveau\n\n\n\n' +
                                  'Titre de niveau 1\n=====================\n\nTitre de niveau 2\n--------------------'
                                }
                              ),
                              new IParagraph({
                                  type: ParagraphType.MarkDown,
                                  content: '+	this is a list item\nindented with tabs\n\n' +
                                  '+   this is a list item\n' +
                                  'indented with spaces\n\n' +
                                  'Code:\n\n	this code block is indented by one tab\n\n' +
                                  'And: \n\n		this code block is indented by two tabs\n\n' +
                                  'And: \n\n+	this is an example list item\n		indented with tabs\n\n' +
                                  '+   this is an example list item\n	    indented with spaces'
                                }
                              ),
                              new IParagraph({
                                  type: ParagraphType.MarkDown,
                                  content:
                                    '\`\`\`javascript\n  var s = "JavaScript syntax highlighting";\n  alert(s);\n\`\`\`\n\n' +
                                    '\`\`\`python\n  s = "Python syntax highlighting"\n  print s\n\`\`\`\n\n' +
                                    '\`\`\`\n  No language indicated, so no syntax highlighting.\n  But let\'s throw in a <b>tag</b>.\n\`\`\`'
                                }
                              ),
                              new IParagraph({
                                  type: ParagraphType.Form,
                                  content: {
                                    type: ParagraphContentType.Radio,
                                    label: 'This is the title of the question',
                                    questions: [
                                      'Is response **True** ?\n\nSecond line',
                                      'Is response **False** ?',
                                      'Or **Neither**'
                                    ],
                                  },
                                  maxCheckCount: 2
                                }
                              ),
                              new IParagraph({
                                  type: ParagraphType.Form,
                                  content: {
                                    type: ParagraphContentType.Checkbox,
                                    label: 'This is the title of the question',
                                    questions: [
                                      'Is response **True** ?\n\nSecond line',
                                      'Is response **False** ?',
                                      'Or **Neither**'
                                    ],
                                  },
                                  maxCheckCount: 3
                                }
                              ),
                              new IParagraph({
                                  type: ParagraphType.Form,
                                  content: {
                                    type: ParagraphContentType.Text,
                                    label: 'This is the title of the question',
                                    question: 'What do you think ?\n\nSecond line',
                                  },
                                  maxCheckCount: 3
                                }
                              ),
                              new IParagraph({
                                  type: ParagraphType.Form,
                                  content: {
                                    type: ParagraphContentType.Radio,
                                    label: 'This is the title of the question',
                                    questions: [
                                      'Is response **True** ?\n\nSecond line',
                                      'Is response **False** ?',
                                      'Or **Neither**'
                                    ],
                                  },
                                  maxCheckCount: 2,
                                  answer: '0'
                                }
                              ),
                              new IParagraph({
                                  type: ParagraphType.Form,
                                  content: {
                                    type: ParagraphContentType.Checkbox,
                                    label: 'This is the title of the question',
                                    questions: [
                                      'Is response **True** ?\n\nSecond line',
                                      'Is response **False** ?',
                                      'Or **Neither**'
                                    ],
                                  },
                                  maxCheckCount: 3,
                                answer: ['0', '2']
                                }
                              ),
                              new IParagraph({
                                  type: ParagraphType.Form,
                                  content: {
                                    type: ParagraphContentType.Text,
                                    label: 'This is the title of the question',
                                    question: 'What do you think ?\n\nSecond line',
                                    size: 20
                                  },
                                  maxCheckCount: 3,
                                  answer: 'sdkfsd sdg'
                                }
                              ),
                              new IParagraph({
                                  type: ParagraphType.Form,
                                  content: {
                                    type: ParagraphContentType.Text,
                                    label: 'This is the title of the question',
                                    question: 'What do you think ?\n\nSecond line',
                                    size: 10
                                  },
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

                async.each(
                  courses,
                  (o, callback) => {
                    var course = new Course(o);
                    Course
                      .updateOrCreate(course)
                      .then(course => {
                        debug("Course created : " + JSON.stringify(course));
                        callback(null);
                      })
                      .catch(err => {
                          debug("Error creating course : " + err);
                          callback(err);
                        }
                      )
                  },
                  err => {
                    callback(err);
                  });
              } else {
                callback();
              }

            })
            .catch(err => {
              debug("Error creating course : " + err);
              console.log(err);
              callback(err);
            });

        },
        function (callback) {
          // ---------------------------
          // Insert User
          // ---------------------------
          User
            .count()
            .then(count => {
              if (count === 0) {
                var users: {}[] = [{
                  username: 'eric',
                  firstname: 'Eric',
                  lastname: 'Machin',
                  email: 'ermachin@airfance.fr',
                  salt: '6MulWcxSt3p0BC4Xa59Xz9O8TUCu3VJE/cTwT2WOjws5XOnZhPfmj5Rku5EY8xzAgUDAgc5Z/6r1y6JLHtknmGINveNFJhadsAkFE+TS4EqI0Nzm8brPpZ3KZLHVLfF2tDBZtp9K5Z/l5WNOQkCFwEKaSzvbhnP+/i4hCZg2kyk=',
                  hashedPassword: 'b80776ef82727b04f57f314a655a31e926d3ea664e7295445409ef113c04c55984082a076ffbff9df377e19d96667026d498ad9bbd4f6211d6da39d7bb0fae331ad08709928513618174bc5a216ca6b74c5fd8e21cbbae0e7e44e24b6ae1d71a24f4088f10ca3533e144df1d66b9300ace3196097cf933b0a5f234b283b0fce3',
                  isAdmin: true
                }];
                async.each(
                  users,
                  (o, callback) => {
                    var user = new User(o);
                    //console.log(user);
                    User
                      .updateOrCreate(user)
                      .then(user => {
                        debug("User created : " + user.username);
                        callback(null);
                      })
                      .catch(err => {
                        debug("Error creating user : " + err);
                        callback(err);
                      })
                  },
                  err => {
                    callback(err);
                  });
              } else {
                callback();
              }
            })
            .catch(err => {
              console.log(err);
            });
        },
        function (callback) {
          // ---------------------------
          // Insert User values for a course
          // ---------------------------
          UserCourse
            .count()
            .then(count => {
              if (count === 0) {
                // get course ids
                Course
                  .find()
                  .then(courses => {
                    let coursesIds = _.shuffle(_.map(courses, f => f['id']));
                    let coursesIdNum = 0;

                    // get the user Id
                    User
                      .find()
                      .then(users => {
                        let userId = users[0]['id'];

                        var userValues = [
                          {
                            userId: userId,
                            courseId: coursesIds[(coursesIdNum++) % coursesIds.length],
                            isFavorite: true,
                            interest: 0.8,
                            dateSeen: new Date('2016-08-14T00:00:00'),
                            dateFollowed: new Date('2016-08-14T00:00:00'),
                            dateFollowedEnd: null,
                            percentFollowed: 0.6,
                          },
                          {
                            userId: userId,
                            courseId: coursesIds[(coursesIdNum++) % coursesIds.length],
                            isFavorite: false,
                            interest: 0.2,
                            dateSeen: new Date('2016-08-22T00:00:00'),
                            dateFollowed: new Date('2016-08-22T00:00:00'),
                            dateFollowedEnd: null,
                            percentFollowed: 0.9,
                          },
                          {
                            userId: userId,
                            courseId: coursesIds[(coursesIdNum++) % coursesIds.length],
                            isFavorite: false,
                            interest: 0.8,
                            dateSeen: new Date('2016-09-23T00:00:00'),
                            dateFollowed: new Date('2016-09-23T00:00:00'),
                            dateFollowedEnd: new Date('2016-10-01T00:00:00'),
                            percentFollowed: 1,
                          },
                          {
                            userId: userId,
                            courseId: coursesIds[(coursesIdNum++) % coursesIds.length],
                            isFavorite: false,
                            interest: 0.1,
                            dateSeen: new Date('2016-08-12T00:00:00'),
                            dateFollowed: new Date('2016-08-12T00:00:00'),
                            dateFollowedEnd: null,
                            percentFollowed: 0.0,
                          },
                          {
                            userId: userId,
                            courseId: coursesIds[(coursesIdNum++) % coursesIds.length],
                            isFavorite: false,
                            interest: 0.1,
                            dateSeen: new Date('2016-05-31T00:00:00'),
                            dateFollowed: new Date('2016-05-31T00:00:00'),
                            dateFollowedEnd: new Date('2016-07-11T00:00:00'),
                            percentFollowed: 1,
                          }
                        ];

                        async.each(
                          userValues,
                          (o, callback) => {
                            var userValue = new UserCourse(o);
                            //console.log(user);
                            UserCourse
                              .updateOrCreate(userValue)
                              .then(userValue => {
                                debug("UserCourse created : " + JSON.stringify(userValue));
                                callback(null);
                              })
                              .catch(err => {
                                debug("Error creating user-course : " + err);
                                callback(err);
                              })
                          },
                          err => {
                            callback(err);
                          });

                      });


                  });
              } else {
                callback();
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      ],
      //global callback
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );


  }
}

