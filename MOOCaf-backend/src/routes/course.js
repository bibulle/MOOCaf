"use strict";
const express_1 = require("express");
const jwt = require("express-jwt");
const _ = require("lodash");
const config_1 = require("../config");
var debug = require('debug')('server:routes:course');
const course_1 = require("../models/course");
const User = require("../models/user");
const UserChoice = require("../models/userChoice");
const IUserCourse = require("../models/UserCourse");
const IUserChoices = require("../models/iUserChoices");
const iCoursePart_1 = require("../models/iCoursePart");
const iParagraph_1 = require("../models/iParagraph");
const UserCourse = require("../models/UserCourse");
const eParagraphType_1 = require("../models/eParagraphType");
const eParagraphContentType_1 = require("../models/eParagraphContentType");
const courseService_1 = require("../service/courseService");
const statService_1 = require("../service/statService");
const courseRouter = express_1.Router();
exports.courseRouter = courseRouter;
// Add JWT management
var jwtCheck = jwt({
    secret: config_1.secret
});
//noinspection TypeScriptValidateTypes
courseRouter.use(jwtCheck);
// -----------------------------------
// --     /api/course routes     --
// -----------------------------------
// ====================================
// route getting for all courses
// ====================================
courseRouter.route('/')
    .get((request, response) => {
    //debug("GET /");
    //debug("connected user : " + JSON.stringify(request['user']));
    _respondWithCoursesList(request, response);
});
// ====================================
// route add a new course
// ====================================
courseRouter.route('/add')
    .get((request, response) => {
    //debug("GET /add");
    //debug("connected user : " + JSON.stringify(request['user']));
    var newCourse = new course_1.default({
        name: "new Course",
        description: "Course description",
    });
    course_1.default.updateOrCreate(newCourse)
        .then(() => {
        _respondWithCoursesList(request, response);
    })
        .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
    });
});
courseRouter.route('/:course_id')
    .get((request, response) => {
    //debug("GET /" + request.params.course_id);
    let courseId = request.params['course_id'];
    //debug("connected user : " + JSON.stringify(request['user']));
    _respondWithCourse(courseId, request['user']["id"], response);
})
    .put((request, response) => {
    var course = new course_1.default(request.body);
    //debug(course);
    //debug("PUT /" + request.params.course_id);
    course_1.default.updateOrCreate(course)
        .then(course => {
        if (course) {
            response.json({ data: course });
        }
        else {
            response.status(404).json({ status: 404, message: "Course not found" });
        }
    })
        .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
    });
});
courseRouter.route('/:course_id/userValues')
    .put((request, response) => {
    var courseId = request.params['course_id'];
    debug("PUT /" + courseId + "/userValues");
    // console.log("0-----");
    // debug(request.body);
    var userCourse = new IUserCourse(request.body);
    userCourse.userId = request['user']["id"];
    userCourse.courseId = courseId;
    // debug(userCourse);
    UserCourse.updateOrCreate(userCourse)
        .then(() => {
        // debug(userCourse);
        statService_1.default.calcStatsUser(request['user']["id"]);
        _respondWithCourse(courseId, request['user']["id"], response);
    })
        .catch(err => {
        console.log(err);
        response.status(500).json({ status: 500, message: "System error " + err });
    });
});
courseRouter.route('/:course_id/para/:paragraphNums')
    .put((request, response) => {
    var courseId = request.params['course_id'];
    var paragraphNums = JSON.parse("[" + request.params['paragraphNums'] + "]");
    var userId = request['user']["id"];
    debug("PUT /" + courseId + "/para/" + paragraphNums);
    //debug(request.body);
    var paragraph = new iParagraph_1.IParagraph(request.body);
    //debug(paragraph);
    // TODO : Add a check of user right
    // Search the userValues
    course_1.default
        .findById(courseId)
        .then(course => {
        //debug(userCourse);
        //debug(userCourse.userChoices[paragraphId]);
        let part = courseService_1.default.searchPartByPath(paragraphNums.slice(0, -1), course.parts);
        part.contents = part.contents || [];
        let paraIndex = paragraphNums[paragraphNums.length - 1];
        if (paragraph['_id'] == null) {
            // new para, add it
            part.contents.splice(paraIndex, 0, paragraph);
        }
        else {
            // replace the para
            part.contents.splice(paraIndex, 1, paragraph);
        }
        // Save the course
        course_1.default
            .updateOrCreate(course)
            .then(() => {
            //debug(course);
            _respondWithCourseParagraph(courseId, paragraph['_id'], paragraphNums, userId, response);
        })
            .catch(err => {
            console.log(err);
            response.status(500).json({ status: 500, message: "System error " + err });
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).json({ status: 500, message: "System error " + err });
    });
})
    .delete((request, response) => {
    var courseId = request.params['course_id'];
    var paragraphNums = JSON.parse("[" + request.params['paragraphNums'] + "]");
    var userId = request['user']["id"];
    debug("DEL /" + courseId + "/para/" + paragraphNums);
    // TODO : Add a check of user right
    // Search the course
    course_1.default
        .findById(courseId)
        .then(course => {
        let parentPartNums = paragraphNums.slice(0, -2);
        let parentParts = course.parts;
        if (parentPartNums.length > 0) {
            parentParts = courseService_1.default.searchPartByPath(parentPartNums, parentParts).parts;
        }
        let parentPart = parentParts[paragraphNums[paragraphNums.length - 2]];
        let paraIndex = paragraphNums[paragraphNums.length - 1];
        // remove the para
        parentPart.contents.splice(paraIndex, 1);
        // Save the course
        course_1.default
            .updateOrCreate(course)
            .then(() => {
            //debug(course);
            _respondWithCoursePart(courseId, null, paragraphNums.slice(0, -1), userId, response);
        })
            .catch(err => {
            console.log(err);
            response.status(500).json({ status: 500, message: "System error " + err });
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).json({ status: 500, message: "System error " + err });
    });
});
courseRouter.route('/:course_id/para/:srcParaNums/move')
    .put((request, response) => {
    var courseId = request.params['course_id'];
    var srcParaNums = JSON.parse("[" + request.params['srcParaNums'] + "]");
    var userId = request['user']["id"];
    debug("PUT /" + courseId + "/para/" + srcParaNums + "/move");
    //debug(request.body);
    var trgParaNum = request.body['trgParaNum'];
    //debug(trgParaNum);
    // TODO : Add a check of user right
    // Search the course
    course_1.default
        .findById(courseId)
        .then(course => {
        // calculate src
        let srcParentPartNums = srcParaNums.slice(0, -2);
        let srcParentParts = course.parts;
        if (srcParentPartNums.length > 0) {
            srcParentParts = courseService_1.default.searchPartByPath(srcParentPartNums, srcParentParts).parts;
        }
        let srcParentPart = srcParentParts[srcParaNums[srcParaNums.length - 2]];
        let srcParaIndex = srcParaNums[srcParaNums.length - 1];
        // calculate trg
        let trgParaIndex = trgParaNum;
        // remove the para from the src
        let paragraph = srcParentPart.contents.splice(srcParaIndex, 1)[0];
        // add the part to the trg
        srcParentPart.contents.splice(trgParaIndex, 0, paragraph);
        // Save the course
        course_1.default
            .updateOrCreate(course)
            .then(() => {
            //debug(course);
            _respondWithCoursePart(courseId, null, srcParaNums.slice(0, -1), userId, response);
        })
            .catch(err => {
            console.log(err);
            response.status(500).json({ status: 500, message: "System error " + err });
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).json({ status: 500, message: "System error " + err });
    });
});
courseRouter.route('/:course_id/para/:trgParaNums/add')
    .put((request, response) => {
    var courseId = request.params['course_id'];
    var trgParaNums = JSON.parse("[" + request.params['trgParaNums'] + "]");
    var userId = request['user']["id"];
    debug("PUT /" + courseId + "/para/" + trgParaNums + "/add");
    //debug(request.body);
    let type = request.body.type;
    let subType = request.body['subType'];
    // TODO : Add a check of user right
    // Search the course
    course_1.default
        .findById(courseId)
        .then(course => {
        // calculate trg
        let trgParentPartNums = trgParaNums.slice(0, -2);
        if (course.parts == null) {
            course.parts = [];
        }
        let trgParentParts = course.parts;
        if (trgParentPartNums.length > 0) {
            let part = courseService_1.default.searchPartByPath(trgParentPartNums, trgParentParts);
            if (part.parts == null) {
                part.parts = [];
            }
            trgParentParts = part.parts;
        }
        if (trgParentParts == null) {
            trgParentParts = [];
        }
        let trgParentPart = trgParentParts[trgParaNums[trgParaNums.length - 2]];
        let trgParaIndex = trgParaNums[trgParaNums.length - 1];
        // create a new paragraph
        let paragraph;
        if (type == eParagraphType_1.ParagraphType.MarkDown) {
            paragraph = new iParagraph_1.IParagraph({
                type: type,
                content: 'content'
            });
        }
        else if (subType == eParagraphContentType_1.ParagraphContentType.Text) {
            paragraph = new iParagraph_1.IParagraph({
                type: type,
                content: {
                    type: subType,
                    label: 'Title',
                    question: 'Question',
                },
                maxCheckCount: 3,
                answer: 'answer'
            });
        }
        else if (subType == eParagraphContentType_1.ParagraphContentType.Radio) {
            paragraph = new iParagraph_1.IParagraph({
                type: type,
                content: {
                    type: subType,
                    label: 'Title',
                    questions: ['Choice 1', 'Choice 2'],
                },
                maxCheckCount: 3,
                answer: 0
            });
        }
        else {
            paragraph = new iParagraph_1.IParagraph({
                type: type,
                content: {
                    type: subType,
                    label: 'Title',
                    questions: ['Choice 1', 'Choice 2'],
                },
                maxCheckCount: 3,
                answer: [0]
            });
        }
        //debug(paragraph);
        // add the part to the trg
        trgParentPart.contents.splice(trgParaIndex, 0, paragraph);
        // Save the course
        course_1.default
            .updateOrCreate(course)
            .then(() => {
            //debug(course);
            _respondWithCoursePart(courseId, null, trgParaNums.slice(0, -1), userId, response);
        })
            .catch(err => {
            console.log(err);
            response.status(500).json({ status: 500, message: "System error " + err });
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).json({ status: 500, message: "System error " + err });
    });
});
courseRouter.route('/:course_id/part/:partNums')
    .put((request, response) => {
    var courseId = request.params['course_id'];
    var partNums = JSON.parse("[" + request.params['partNums'] + "]");
    var userId = request['user']["id"];
    debug("PUT /" + courseId + "/part/" + partNums);
    //debug(request.body);
    var coursePart = new iCoursePart_1.ICoursePart(request.body);
    //(coursePart);
    // TODO : Add a check of user right
    // Search the userValues
    course_1.default
        .findById(courseId)
        .then(course => {
        let parentPartNums = partNums.slice(0, -1);
        let parentParts = course.parts;
        if (parentPartNums.length > 0) {
            parentParts = courseService_1.default.searchPartByPath(parentPartNums, parentParts).parts;
        }
        let partIndex = partNums[partNums.length - 1];
        if (coursePart['_id'] == null) {
            // new page, add it
            parentParts.splice(partIndex, 0, coursePart);
        }
        else {
            // replace the page
            parentParts.splice(partIndex, 1, coursePart);
        }
        // Save the course
        course_1.default
            .updateOrCreate(course)
            .then(() => {
            //debug(course);
            _respondWithCoursePart(courseId, coursePart['_id'], partNums, userId, response);
        })
            .catch(err => {
            console.log(err);
            response.status(500).json({ status: 500, message: "System error " + err });
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).json({ status: 500, message: "System error " + err });
    });
})
    .delete((request, response) => {
    var courseId = request.params['course_id'];
    var partNums = JSON.parse("[" + request.params['partNums'] + "]");
    var userId = request['user']["id"];
    debug("DEL /" + courseId + "/part/" + partNums);
    // TODO : Add a check of user right
    // Search the course
    course_1.default
        .findById(courseId)
        .then(course => {
        let parentPartNums = partNums.slice(0, -1);
        let parentParts = course.parts;
        if (parentPartNums.length > 0) {
            parentParts = courseService_1.default.searchPartByPath(parentPartNums, parentParts).parts;
        }
        let partIndex = partNums[partNums.length - 1];
        // remove the part
        parentParts.splice(partIndex, 1);
        // Save the course
        course_1.default
            .updateOrCreate(course)
            .then(() => {
            //debug(course);
            _respondWithCourse(courseId, userId, response);
        })
            .catch(err => {
            console.log(err);
            response.status(500).json({ status: 500, message: "System error " + err });
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).json({ status: 500, message: "System error " + err });
    });
});
courseRouter.route('/:course_id/part/:srcPartNums/move')
    .put((request, response) => {
    var courseId = request.params['course_id'];
    var srcPartNums = JSON.parse("[" + request.params['srcPartNums'] + "]");
    var userId = request['user']["id"];
    debug("PUT /" + courseId + "/part/" + srcPartNums + "/move");
    //debug(request.body);
    var trgPartNums = request.body;
    //debug(trgPartNums);
    // TODO : Add a check of user right
    // Search the course
    course_1.default
        .findById(courseId)
        .then(course => {
        // calculate src
        let srcParentPartNums = srcPartNums.slice(0, -1);
        let srcParentParts = course.parts;
        if (srcParentPartNums.length > 0) {
            srcParentParts = courseService_1.default.searchPartByPath(srcParentPartNums, srcParentParts).parts;
        }
        let srcPartIndex = srcPartNums[srcPartNums.length - 1];
        // calculate trg
        let trgParentPartNums = trgPartNums.slice(0, -1);
        let trgParentParts = course.parts;
        if (trgParentPartNums.length > 0) {
            trgParentParts = courseService_1.default.searchPartByPath(trgParentPartNums, trgParentParts).parts;
        }
        let trgPartIndex = trgPartNums[trgPartNums.length - 1];
        // remove the part from the src
        let coursePart = srcParentParts.splice(srcPartIndex, 1)[0];
        // add the part to the trg
        trgParentParts.splice(trgPartIndex, 0, coursePart);
        // Save the course
        course_1.default
            .updateOrCreate(course)
            .then(() => {
            //debug(course);
            _respondWithCourse(courseId, userId, response);
        })
            .catch(err => {
            console.log(err);
            response.status(500).json({ status: 500, message: "System error " + err });
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).json({ status: 500, message: "System error " + err });
    });
});
courseRouter.route('/:course_id/part/:trgPartNums/add')
    .put((request, response) => {
    var courseId = request.params['course_id'];
    var trgPartNums = JSON.parse("[" + request.params['trgPartNums'] + "]");
    var userId = request['user']["id"];
    debug("PUT /" + courseId + "/part/" + trgPartNums + "/add");
    //debug(request.body);
    // TODO : Add a check of user right
    // Search the course
    course_1.default
        .findById(courseId)
        .then(course => {
        // calculate trg
        let trgParentPartNums = trgPartNums.slice(0, -1);
        if (course.parts == null) {
            course.parts = [];
        }
        let trgParentParts = course.parts;
        if (trgParentPartNums.length > 0) {
            let part = courseService_1.default.searchPartByPath(trgParentPartNums, trgParentParts);
            if (part.parts == null) {
                part.parts = [];
            }
            trgParentParts = part.parts;
        }
        if (trgParentParts == null) {
            trgParentParts = [];
        }
        let trgPartIndex = trgPartNums[trgPartNums.length - 1];
        // create a new coursePart
        let coursePart = new iCoursePart_1.ICoursePart({
            title: "New page",
            parts: [],
            contents: []
        });
        // add the part to the trg
        trgParentParts.splice(trgPartIndex, 0, coursePart);
        // Save the course
        course_1.default
            .updateOrCreate(course)
            .then(() => {
            //debug(course);
            _respondWithCourse(courseId, userId, response);
        })
            .catch(err => {
            console.log(err);
            response.status(500).json({ status: 500, message: "System error " + err });
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).json({ status: 500, message: "System error " + err });
    });
});
courseRouter.route('/:course_id/:paragraph_id/userChoice')
    .put((request, response) => {
    var courseId = request.params['course_id'];
    var paragraphId = request.params['paragraph_id'];
    var userId = request['user']["id"];
    debug("PUT /" + courseId + "/" + paragraphId + "/userChoice");
    //debug(request.body);
    var userChoice = new UserChoice(request.body);
    //debug(userChoice);
    // Search the userValues
    UserCourse.findByUserIdCourseId(userId, courseId)
        .then(userCourse => {
        //debug(userCourse);
        //debug(userCourse.userChoices[paragraphId]);
        if (userCourse == null) {
            userCourse = new UserCourse({ courseId: courseId, userId: userId });
        }
        if (userCourse.userChoices == null) {
            userCourse.userChoices = {};
        }
        if (userCourse.userChoices[paragraphId] == null) {
            userCourse.userChoices[paragraphId] = new IUserChoices();
        }
        _.assign(userCourse.userChoices[paragraphId], userChoice);
        if (!userCourse.userChoices[paragraphId].userCheckCount) {
            userCourse.userChoices[paragraphId].userCheckCount = 0;
        }
        userCourse.userChoices[paragraphId].updated = new Date();
        //debug(userCourse.userChoices[paragraphId]);
        courseService_1.default.calcProgression(userCourse)
            .then((userCourse) => {
            UserCourse
                .updateOrCreate(userCourse)
                .then(() => {
                statService_1.default.calcStatsUser(userId);
                _respondWithCourseParagraph(courseId, paragraphId, null, userId, response);
            })
                .catch(err => {
                console.log(err);
                response.status(500).json({ status: 500, message: "System error " + err });
            });
        })
            .catch(err => {
            console.log(err);
            response.status(500).json({ status: 500, message: "System error " + err });
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).json({ status: 500, message: "System error " + err });
    });
});
courseRouter.route('/:course_id/:paragraph_id/userChoice/check')
    .put((request, response) => {
    var courseId = request.params['course_id'];
    var paragraphId = request.params['paragraph_id'];
    var userId = request['user']["id"];
    debug("PUT /" + courseId + "/" + paragraphId + "/userChoice/check'");
    //debug(request.body);
    var userChoice = new UserChoice(request.body);
    //debug(userChoice);
    // Search the user Values (to check if check can be done)
    UserCourse
        .findByUserIdCourseId(userId, courseId)
        .then(userCourse => {
        if (userCourse == null) {
            userCourse = new UserCourse({ courseId: courseId, userId: userId });
        }
        if (userCourse.userChoices == null) {
            userCourse.userChoices = {};
        }
        if (userCourse.userChoices[paragraphId] == null) {
            userCourse.userChoices[paragraphId] = new IUserChoices();
        }
        _.assign(userCourse.userChoices[paragraphId], userChoice);
        if (!userCourse.userChoices[paragraphId].userCheckCount) {
            userCourse.userChoices[paragraphId].userCheckCount = 0;
        }
        userCourse.userChoices[paragraphId].updated = new Date();
        //debug(userCourse.userChoices[paragraphId]);
        // get the paragraph
        course_1.default.findById(courseId)
            .then(course => {
            let paragraph = courseService_1.default.searchParagraphById(paragraphId, course.parts);
            if (paragraph != null) {
                // check the user choice
                if (paragraph.maxCheckCount <= userCourse.userChoices[paragraphId].userCheckCount) {
                    // Too many try, won't be saved
                    response.status(401).json({ status: 401, message: "Too many try" });
                }
                else if (userCourse.userChoices[paragraphId].userCheckOK === true) {
                    // Answer already correct
                    response.status(401).json({ status: 401, message: "Answer already correct" });
                }
                else {
                    // Do the check
                    userCourse.userChoices[paragraphId].userCheckOK = ("" + userCourse.userChoices[paragraphId].userChoice == "" + paragraph.answer);
                    userCourse.userChoices[paragraphId].userCheckCount += 1;
                    userCourse.userChoices[paragraphId].updated = new Date();
                    // if done, set it
                    if ((userCourse.userChoices[paragraphId].userCheckOK === true) || (paragraph.maxCheckCount <= userCourse.userChoices[paragraphId].userCheckCount)) {
                        userCourse.userChoices[paragraphId].userDone = new Date();
                    }
                    // save it to Db
                    courseService_1.default.calcProgression(userCourse)
                        .then((userCourse) => {
                        UserCourse
                            .updateOrCreate(userCourse)
                            .then(() => {
                            statService_1.default.calcStatsUser(userId);
                            _respondWithCourseParagraph(courseId, paragraphId, null, request['user']["id"], response);
                        })
                            .catch(err => {
                            console.log(err);
                            response.status(500).json({ status: 500, message: "System error " + err });
                        });
                    })
                        .catch(err => {
                        console.log(err);
                        response.status(500).json({ status: 500, message: "System error " + err });
                    });
                }
            }
            else {
                response.status(404).json({ status: 404, message: "Course not found" });
            }
        })
            .catch(err => {
            console.log(err);
            response.status(500).send("System error " + err);
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).json({ status: 500, message: "System error " + err });
    });
});
/**
 * Get the courses list (for this user)
 * @param request
 * @param response
 * @private
 */
function _respondWithCoursesList(request, response) {
    var currentOnly = false;
    var progressOnly = false;
    if (request.query['currentOnly']) {
        currentOnly = (request.query['currentOnly'] === "true");
    }
    if (request.query['progressOnly']) {
        progressOnly = (request.query['progressOnly'] === "true");
    }
    courseService_1.default.getCourses(request['user']["id"], currentOnly, progressOnly)
        .then((completedCourses) => {
        response.json({ data: completedCourses });
    })
        .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
    });
}
/**
 * Get a course (filled) by Id
 * @param courseId
 * @param userId
 * @param response
 * @private
 */
function _respondWithCourse(courseId, userId, response) {
    //debug("_respondWithCourse : " + courseId + ", " + userId);
    course_1.default.findById(courseId)
        .then(course => {
        // Search the user
        User.findById(userId)
            .then(user => {
            if (course) {
                courseService_1.default.fillCourseForUser(course, user)
                    .then(cou => {
                    //debug(cou);
                    response.json({ data: cou });
                })
                    .catch(err => {
                    console.log(err);
                    response.status(500).send("System error " + err);
                });
            }
            else {
                response.status(404).json({ status: 404, message: "Course not found" });
            }
        })
            .catch(err => {
            console.log(err);
            response.status(500).send("System error " + err);
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
    });
}
/**
 * Get a paragraph (filled) by Id or path
 * @param courseId
 * @param paragraphId
 * @param paragraphNums
 * @param userId
 * @param response
 * @private
 */
function _respondWithCourseParagraph(courseId, paragraphId, paragraphNums, userId, response) {
    //debug("_respondWithCourse : " + courseId + ", " + userId);
    course_1.default.findById(courseId)
        .then(course => {
        // Search the user
        User.findById(userId)
            .then(user => {
            if (course) {
                courseService_1.default.fillCourseForUser(course, user)
                    .then(cou => {
                    // search for the paragraph
                    let para;
                    if (paragraphId) {
                        para = courseService_1.default.searchParagraphById(paragraphId, cou.parts);
                    }
                    else {
                        para = courseService_1.default.searchParagraphByPath(paragraphNums, cou.parts);
                    }
                    if (para != null) {
                        response.json({ data: para });
                    }
                    else {
                        response.status(404).json({ status: 404, message: "Course not found" });
                    }
                })
                    .catch(err => {
                    console.log(err);
                    response.status(500).send("System error " + err);
                });
            }
            else {
                response.status(404).json({ status: 404, message: "Course not found" });
            }
        })
            .catch(err => {
            console.log(err);
            response.status(500).send("System error " + err);
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
    });
}
/**
 * Get a course part (filled) by Id or path (nums)
 * @param courseId
 * @param coursePartId
 * @param partNums
 * @param userId
 * @param response
 * @private
 */
function _respondWithCoursePart(courseId, coursePartId, partNums, userId, response) {
    //debug("_respondWithCoursePart : " + courseId + ", " + coursePartId+ ", " + partNums);
    course_1.default.findById(courseId)
        .then(course => {
        // Search the user
        User.findById(userId)
            .then(user => {
            if (course) {
                courseService_1.default.fillCourseForUser(course, user)
                    .then(cou => {
                    // search for the part
                    let part;
                    if (coursePartId) {
                        part = courseService_1.default.searchPartById(coursePartId, cou.parts);
                    }
                    else {
                        part = courseService_1.default.searchPartByPath(partNums, cou.parts);
                    }
                    if (part != null) {
                        response.json({ data: part });
                    }
                    else {
                        response.status(404).json({ status: 404, message: "Page not found" });
                    }
                })
                    .catch(err => {
                    console.log(err);
                    response.status(500).send("System error " + err);
                });
            }
            else {
                response.status(404).json({ status: 404, message: "Page not found" });
            }
        })
            .catch(err => {
            console.log(err);
            response.status(500).send("System error " + err);
        });
    })
        .catch(err => {
        console.log(err);
        response.status(500).send("System error " + err);
    });
}
//# sourceMappingURL=course.js.map