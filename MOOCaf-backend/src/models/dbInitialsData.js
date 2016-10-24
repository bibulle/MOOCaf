"use strict";
var async = require('async');
const _ = require('lodash');
var debug = require('debug')('server:model:init-db');
const course_1 = require("./course");
const eParagraphType_1 = require("./eParagraphType");
const iParagraph_1 = require("./iParagraph");
const eParagraphContentType_1 = require("./eParagraphContentType");
const User = require("./user");
const UserCourse = require("./UserCourse");
const award_1 = require("./award");
const UserStats = require("./UserStats");
const eStatKey_1 = require("./eStatKey");
class DbInitialsData {
    static init() {
        // Init database if it's empty
        async.series([
            function (callback) {
                // ---------------------------
                // Insert course
                // ---------------------------
                course_1.default.count()
                    .then(count => {
                    if (count === 0) {
                        var courses = [
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
                                                    new iParagraph_1.IParagraph({
                                                        type: eParagraphType_1.ParagraphType.MarkDown,
                                                        content: '*few words* or  _few words_\n\n**plus important** ou __également important__\n\n' +
                                                            'Mon texte `code` fin de mon texte\n\n' +
                                                            '    Première ligne de code\n    Deuxième ligne\n\n' +
                                                            '> Ce texte apparaîtra dans un élément HTML blockquote.\n\n' +
                                                            '* Pommes\n* Poires\n    * Sous élément avec au moins quatre espaces devant.\n\n' +
                                                            '1. mon premier\n2. mon deuxième\n\n' +
                                                            '# un titre de premier niveau\n#### un titre de quatrième niveau\n\n\n\n' +
                                                            'Titre de niveau 1\n=====================\n\nTitre de niveau 2\n--------------------'
                                                    }),
                                                    new iParagraph_1.IParagraph({
                                                        type: eParagraphType_1.ParagraphType.MarkDown,
                                                        content: '+	this is a list item\nindented with tabs\n\n' +
                                                            '+   this is a list item\n' +
                                                            'indented with spaces\n\n' +
                                                            'Code:\n\n	this code block is indented by one tab\n\n' +
                                                            'And: \n\n		this code block is indented by two tabs\n\n' +
                                                            'And: \n\n+	this is an example list item\n		indented with tabs\n\n' +
                                                            '+   this is an example list item\n	    indented with spaces'
                                                    }),
                                                    new iParagraph_1.IParagraph({
                                                        type: eParagraphType_1.ParagraphType.MarkDown,
                                                        content: '\`\`\`javascript\n  var s = "JavaScript syntax highlighting";\n  alert(s);\n\`\`\`\n\n' +
                                                            '\`\`\`python\n  s = "Python syntax highlighting"\n  print s\n\`\`\`\n\n' +
                                                            '\`\`\`\n  No language indicated, so no syntax highlighting.\n  But let\'s throw in a <b>tag</b>.\n\`\`\`'
                                                    }),
                                                    new iParagraph_1.IParagraph({
                                                        type: eParagraphType_1.ParagraphType.Form,
                                                        content: {
                                                            type: eParagraphContentType_1.ParagraphContentType.Radio,
                                                            label: 'This is the title of the question',
                                                            questions: [
                                                                'Is response **True** ?\n\nSecond line',
                                                                'Is response **False** ?',
                                                                'Or **Neither**'
                                                            ],
                                                        },
                                                        maxCheckCount: 2
                                                    }),
                                                    new iParagraph_1.IParagraph({
                                                        type: eParagraphType_1.ParagraphType.Form,
                                                        content: {
                                                            type: eParagraphContentType_1.ParagraphContentType.Checkbox,
                                                            label: 'This is the title of the question',
                                                            questions: [
                                                                'Is response **True** ?\n\nSecond line',
                                                                'Is response **False** ?',
                                                                'Or **Neither**'
                                                            ],
                                                        },
                                                        maxCheckCount: 3
                                                    }),
                                                    new iParagraph_1.IParagraph({
                                                        type: eParagraphType_1.ParagraphType.Form,
                                                        content: {
                                                            type: eParagraphContentType_1.ParagraphContentType.Text,
                                                            label: 'This is the title of the question',
                                                            question: 'What do you think ?\n\nSecond line',
                                                        },
                                                        maxCheckCount: 3
                                                    }),
                                                    new iParagraph_1.IParagraph({
                                                        type: eParagraphType_1.ParagraphType.Form,
                                                        content: {
                                                            type: eParagraphContentType_1.ParagraphContentType.Radio,
                                                            label: 'This is the title of the question',
                                                            questions: [
                                                                'Is response **True** ?\n\nSecond line',
                                                                'Is response **False** ?',
                                                                'Or **Neither**'
                                                            ],
                                                        },
                                                        maxCheckCount: 2,
                                                        answer: '0'
                                                    }),
                                                    new iParagraph_1.IParagraph({
                                                        type: eParagraphType_1.ParagraphType.Form,
                                                        content: {
                                                            type: eParagraphContentType_1.ParagraphContentType.Checkbox,
                                                            label: 'This is the title of the question',
                                                            questions: [
                                                                'Is response **True** ?\n\nSecond line',
                                                                'Is response **False** ?',
                                                                'Or **Neither**'
                                                            ],
                                                        },
                                                        maxCheckCount: 3,
                                                        answer: ['0', '2']
                                                    }),
                                                    new iParagraph_1.IParagraph({
                                                        type: eParagraphType_1.ParagraphType.Form,
                                                        content: {
                                                            type: eParagraphContentType_1.ParagraphContentType.Text,
                                                            label: 'This is the title of the question',
                                                            question: 'What do you think ?\n\nSecond line',
                                                            size: 20
                                                        },
                                                        maxCheckCount: 3,
                                                        answer: 'sdkfsd sdg'
                                                    }),
                                                    new iParagraph_1.IParagraph({
                                                        type: eParagraphType_1.ParagraphType.Form,
                                                        content: {
                                                            type: eParagraphContentType_1.ParagraphContentType.Text,
                                                            label: 'This is the title of the question',
                                                            question: 'What do you think ?\n\nSecond line',
                                                            size: 10
                                                        },
                                                        maxCheckCount: 3,
                                                        answer: 'sdkfsd sdg'
                                                    }),
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
                        async.each(courses, (o, callback) => {
                            var course = new course_1.default(o);
                            course_1.default
                                .updateOrCreate(course)
                                .then(course => {
                                debug("Course created : " + JSON.stringify(course));
                                callback(null);
                            })
                                .catch(err => {
                                debug("Error creating course : " + err);
                                callback(err);
                            });
                        }, err => {
                            callback(err);
                        });
                    }
                    else {
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
                        var users = [{
                                username: 'eric',
                                firstname: 'Eric',
                                lastname: 'Machin',
                                email: 'ermachin@airfance.fr',
                                salt: '1wtjyjBwtFWCRJJTs+eNYO6B4HXCaG7n2wP2ZyrU5ZVHX4N5ritgx3fB290VtEaIhf0Cj/ZbC1q4ELQa5tjRUze2SFnMFCS2m57wBOkg3csouLRzZGKEdkqTAH3AjfLdiNS2KJWhrGmoJIvr/wGOEtvlDSFDxJ4u2D0oeumTQNA=',
                                hashedPassword: 'af22da94041021c40a2f3490993933a71682856f8c12c757fd6d91278fd3fc8ea18b09ae18b9318b813dccec70d7627044b77ee1143fbc8f371122910dcf6134e4a914342cd9cb8d5f3c7142fd1e04b48dde66acc768c46efc8fa3e9f584eed42990ad358a1f74339eab88dbc33816f441fa4a5f3eba6fbd6b2ce088cbb6026f',
                                isAdmin: true
                            }];
                        async.each(users, (o, callback) => {
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
                            });
                        }, err => {
                            callback(err);
                        });
                    }
                    else {
                        callback();
                    }
                })
                    .catch(err => {
                    console.log(err);
                });
            },
            function (callback) {
                // ---------------------------
                // Insert Awards
                // ---------------------------
                award_1.default
                    .count()
                    .then(count => {
                    if (count === 0) {
                        var awards = [
                            {
                                name: 'Apprentice',
                                description: 'You have finished 5 courses',
                                level: 0,
                                imgPath: 'cup_5.svg',
                                statKey: eStatKey_1.StatKey.COUNT_FINISHED_COURSE,
                                limitCount: 5
                            },
                            {
                                name: 'Schollar',
                                description: 'You have finished 10 courses',
                                level: 1,
                                imgPath: 'cup_10.svg',
                                statKey: eStatKey_1.StatKey.COUNT_FINISHED_COURSE,
                                limitCount: 10
                            },
                            {
                                name: 'Expert',
                                description: 'You have finished 25 courses',
                                level: 2,
                                imgPath: 'cup_25.svg',
                                statKey: eStatKey_1.StatKey.COUNT_FINISHED_COURSE,
                                limitCount: 25
                            },
                            {
                                name: 'Good boy',
                                description: 'You have participated in a survey',
                                level: 1,
                                imgPath: 'question.svg',
                                statKey: eStatKey_1.StatKey.COUNT_FINISHED_SURVEY,
                                limitCount: 1
                            },
                            {
                                name: 'Speedy Gonzales',
                                description: 'You have finished a course in less than 24 hours',
                                level: 2,
                                imgPath: 'time.svg',
                                statKey: eStatKey_1.StatKey.MIN_FINISHED_COURSE_DURATION,
                                limitCount: 1
                            },
                            {
                                name: 'Teacher',
                                description: 'You have created 1 course',
                                level: 1,
                                imgPath: 'teacher_1.svg',
                                statKey: eStatKey_1.StatKey.COUNT_CREATED_COURSE,
                                limitCount: 1
                            },
                            {
                                name: 'Chairman',
                                description: 'You have created 5 courses',
                                level: 2,
                                imgPath: 'teacher_2.svg',
                                statKey: eStatKey_1.StatKey.COUNT_CREATED_COURSE,
                                limitCount: 5
                            },
                            {
                                name: 'Flawless',
                                description: 'You had a 100% good answer',
                                level: 1,
                                imgPath: 'counter.svg',
                                statKey: eStatKey_1.StatKey.MAX_PERCENT_GOOD_ANSWER,
                                limitCount: 1
                            },
                            {
                                name: 'Motley',
                                description: 'You have learned in 5 different categories',
                                level: 2,
                                imgPath: 'book.svg',
                                statKey: eStatKey_1.StatKey.COUNT_FINISHED_COURSE_CATEGORIES,
                                limitCount: 5
                            },
                            {
                                name: 'Procrastinator',
                                description: 'You start 5 courses in parallel',
                                level: 0,
                                imgPath: 'thinking.svg',
                                statKey: eStatKey_1.StatKey.MAX_COUNT_STARTED_COURSE_IN_PARALLEL,
                                secret: true,
                                limitCount: 5
                            },
                            {
                                name: 'Platinum',
                                description: 'Got all the awards... You should consider working in TECC-SE ?',
                                level: 3,
                                imgPath: 'platinum.svg',
                                statKey: eStatKey_1.StatKey.COUNT_AWARDS,
                                limitCount: 10
                            }
                        ];
                        async.each(awards, (o, callback) => {
                            var award = new award_1.default(o);
                            //console.log(user);
                            award_1.default
                                .updateOrCreate(award)
                                .then(award => {
                                debug("Award created : " + award);
                                callback(null);
                            })
                                .catch(err => {
                                debug("Error creating award : " + err);
                                callback(err);
                            });
                        }, err => {
                            callback(err);
                        });
                    }
                    else {
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
                        course_1.default
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
                                async.each(userValues, (o, callback) => {
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
                                    });
                                }, err => {
                                    callback(err);
                                });
                            });
                        });
                    }
                    else {
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
                UserStats
                    .count()
                    .then(count => {
                    if (count === 0) {
                        // get the user Id
                        User
                            .find()
                            .then(users => {
                            let userId = users[0]['id'];
                            var userStats = [
                                {
                                    userId: userId,
                                    statKey: eStatKey_1.StatKey.COUNT_FINISHED_COURSE,
                                    userCount: 7,
                                },
                                {
                                    userId: userId,
                                    statKey: eStatKey_1.StatKey.COUNT_FINISHED_SURVEY,
                                    userCount: 1,
                                },
                                {
                                    userId: userId,
                                    statKey: eStatKey_1.StatKey.COUNT_CREATED_COURSE,
                                    userCount: 2,
                                },
                                {
                                    userId: userId,
                                    statKey: eStatKey_1.StatKey.COUNT_AWARDS,
                                    userCount: 3,
                                },
                            ];
                            async.each(userStats, (o, callback) => {
                                var userAward = new UserStats(o);
                                //console.log(user);
                                UserStats
                                    .updateOrCreate(userAward)
                                    .then(userAward => {
                                    debug("UserStats created : " + JSON.stringify(userAward));
                                    callback(null);
                                })
                                    .catch(err => {
                                    debug("Error creating user-award : " + err);
                                    callback(err);
                                });
                            }, err => {
                                callback(err);
                            });
                        });
                    }
                    else {
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
        });
    }
}
exports.DbInitialsData = DbInitialsData;
//# sourceMappingURL=dbInitialsData.js.map