import { Router, Response, Request } from "express";
import * as jwt from "express-jwt";
import * as _ from "lodash";
import { secret } from "../config";
const debug = require('debug')('server:routes:course:debug');
const info = require('debug')('server:routes:course:info');
const error = require('debug')('server:routes:course:error');
import Course from "../models/course";
import User = require("../models/user");
import UserChoice = require("../models/userChoice");
import isUndefined = require("lodash/isUndefined");
import IUserCourse = require("../models/UserCourse");
import IUserChoices = require("../models/iUserChoices");
import Paragraph = require("../models/paragraph");
import { ICoursePart } from "../models/iCoursePart";
import { IParagraph } from "../models/iParagraph";
import UserCourse = require("../models/UserCourse");
import { ParagraphType } from "../models/eParagraphType";
import { ParagraphContentType } from "../models/eParagraphContentType";
import { ICourse } from "../models/iCourse";
import IUserPart = require("../models/iUserParts");
import CourseService from "../service/courseService";
import StatService from "../service/statService";
import UserService from "../service/userService";
import { EditRightType } from "../service/userService";
import ParagraphService from "../service/paragraphService";
import JobService from "../service/jobService";


const courseRouter: Router = Router();

// Add JWT management
const jwtCheck = jwt({
  secret: secret
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
            .get((request: Request, response: Response) => {
              //debug("GET /");
              //debug("connected user : " + JSON.stringify(request['user']));
              _respondWithCoursesList(request, response);
            });

// ====================================
// route add a new course
// ====================================
courseRouter.route('/add')
            .get((request: Request, response: Response) => {
              //debug("GET /add");
              //debug("connected user : " + JSON.stringify(request['user']));

              const userId = request['user']["id"];

              UserService.checkUserRightAndRespond(userId, EditRightType.EditCoursesCatalogue, null, response, () => {

                const newCourse = new Course({
                  name: "new Course",
                  description: "Course description",
                });

                Course.updateOrCreate(newCourse)
                      .then(() => {
                        _respondWithCoursesList(request, response);
                      })
                      .catch(err => {
                        console.log(err);
                        response.status(500).send("System error " + err);
                      });
              });
            });

courseRouter.route('/:course_id')
            // ====================================
            // route for getting one course
            // ====================================
            .get((request: Request, response: Response) => {
              //debug("GET /" + request.params.course_id);
              let courseId = request.params['course_id'];
              //debug("connected user : " + JSON.stringify(request['user']));

              _respondWithCourse(courseId, request['user']["id"], response);

            })

            // ====================================
            // update a course
            // ====================================
            .put((request: Request, response: Response) => {

              const course = new Course(request.body);
              //debug(course);
              //debug("PUT /" + request.params.course_id);

              const userId = request['user']["id"];
              UserService.checkUserRightAndRespond(userId, EditRightType.EditCourse, course['id'], response, () => {

                Course.updateOrCreate(course)
                      .then(course => {
                        if (course) {
                          response.json({data: course});
                        } else {
                          response.status(404).json({status: 404, message: "Course not found"});
                        }
                      })
                      .catch(err => {
                        console.log(err);
                        response.status(500).send("System error " + err);
                      });
              });

            })
            // ============================================
            // remove an course
            // ============================================
            .delete((request: Request, response: Response) => {

              let courseId = request.params['course_id'];

              debug("DELETE /" + courseId);

              const userId = request['user']["id"];
              UserService.checkUserRightAndRespond(userId, EditRightType.EditCoursesCatalogue, null, response, () => {

                // remove it
                Course.remove(courseId)
                      .then(() => {
                        UserCourse.removeByCourseId(courseId)
                                  .then(() => {
                                    StatService.calcStatsUser(request['user']["id"]);
                                    response.status(200).json({status: 200, message: "Delete done "});
                                  })
                                  .catch(err => {
                                    console.log(err);
                                    response.status(500).json({status: 500, message: "System error " + err});
                                  });
                      })
                      .catch(err => {
                        console.log(err);
                        response.status(500).json({status: 500, message: "System error " + err});
                      });
              });
            });


courseRouter.route('/:course_id/reset')
            // ====================================
            // reset a course
            // ====================================
            .get((request: Request, response: Response) => {

              const courseId = request.params['course_id'];

              debug("GET /" + courseId + "/reset");

              const userId = request['user']["id"];
              UserService.checkUserRightAndRespond(userId, EditRightType.EditCoursesCatalogue, null, response, () => {

                UserCourse.removeByCourseId(courseId)
                          .then(() => {
                            // debug(userCourse);

                            StatService.calcStatsUser(request['user']["id"]);

                            response.status(200).json({status: 200, message: "Reset done "});
                          })
                          .catch(err => {
                            console.log(err);
                            response.status(500).json({status: 500, message: "System error " + err});
                          });

              });
            });

courseRouter.route('/:course_id/userValues')
            // ====================================
            // update user values for a course
            // ====================================
            .put((request: Request, response: Response) => {

              const courseId = request.params['course_id'];

              debug("PUT /" + courseId + "/userValues");

              // console.log("0-----");
              // debug(request.body);
              const userCourse = new IUserCourse(request.body);

              userCourse.userId = request['user']["id"];
              userCourse.courseId = courseId;

              // debug(userCourse);

              UserCourse.updateOrCreate(userCourse)
                        .then(() => {
                          // debug(userCourse);

                          StatService.calcStatsUser(request['user']["id"]);

                          _respondWithCourse(courseId, request['user']["id"], response);

                        })
                        .catch(err => {
                          console.log(err);
                          response.status(500).json({status: 500, message: "System error " + err});
                        });

            });

courseRouter.route('/:course_id/para/:paragraphNums')
            // ============================================
            // update a course paragraph
            // ============================================
            .put((request: Request, response: Response) => {

              const courseId = request.params['course_id'];
              const paragraphNums = JSON.parse("[" + request.params['paragraphNums'] + "]");
              const userId = request['user']["id"];

              debug("PUT /" + courseId + "/para/" + paragraphNums);
              //debug(request.body);

              const paragraph = new IParagraph(request.body);
              //debug(paragraph);

              // Sort the answer to be sure it could be compared to user choice
              if (paragraph.answer instanceof Array) {
                paragraph.answer = paragraph.answer.sort();
              }

              UserService.checkUserRightAndRespond(userId, EditRightType.EditCourse, courseId, response, () => {

                // Search the userValues
                Course
                  .findById(courseId)
                  .then(course => {
                    //debug(userCourse);
                    //debug(userCourse.userChoices[paragraphId]);

                    let part = CourseService.searchPartByPath(paragraphNums.slice(0, -1), course.parts);
                    part.contents = part.contents || [];

                    let paraIndex = paragraphNums[paragraphNums.length - 1];

                    if (paragraph['_id'] == null) {
                      // new para, add it
                      part.contents.splice(paraIndex, 0, paragraph);
                    } else {
                      // replace the para
                      part.contents.splice(paraIndex, 1, paragraph);
                    }

                    // Save the course
                    Course
                      .updateOrCreate(course)
                      .then(() => {
                        //debug(course);
                        _respondWithCourseParagraph(courseId, paragraph['_id'], paragraphNums, userId, response);
                      })
                      .catch(err => {
                        console.log(err);
                        response.status(500).json({status: 500, message: "System error " + err});
                      })

                  })
                  .catch(err => {
                    console.log(err);
                    response.status(500).json({status: 500, message: "System error " + err});
                  });
              });

            })
            // ============================================
            // remove a course paragraph
            // ============================================
            .delete((request: Request, response: Response) => {

              const courseId = request.params['course_id'];
              const paragraphNums = JSON.parse("[" + request.params['paragraphNums'] + "]");
              const userId = request['user']["id"];

              debug("DEL /" + courseId + "/para/" + paragraphNums);

              UserService.checkUserRightAndRespond(userId, EditRightType.EditCourse, courseId, response, () => {

                // Search the course
                Course
                  .findById(courseId)
                  .then(course => {

                    let parentPartNums = paragraphNums.slice(0, -2);

                    let parentParts = course.parts;
                    if (parentPartNums.length > 0) {
                      parentParts = CourseService.searchPartByPath(parentPartNums, parentParts).parts;
                    }
                    let parentPart = parentParts[paragraphNums[paragraphNums.length - 2]];
                    let paraIndex = paragraphNums[paragraphNums.length - 1];

                    // remove the para
                    parentPart.contents.splice(paraIndex, 1);

                    // Save the course
                    Course
                      .updateOrCreate(course)
                      .then(() => {
                        //debug(course);
                        _respondWithCoursePart(courseId, null, paragraphNums.slice(0, -1), userId, response);
                      })
                      .catch(err => {
                        console.log(err);
                        response.status(500).json({status: 500, message: "System error " + err});
                      })

                  })
                  .catch(err => {
                    console.log(err);
                    response.status(500).json({status: 500, message: "System error " + err});
                  });
              });

            });

courseRouter.route('/:course_id/para/:srcParaNums/move')
            // ============================================
            // move a course paragraph
            // ============================================
            .put((request: Request, response: Response) => {

              const courseId = request.params['course_id'];
              const srcParaNums = JSON.parse("[" + request.params['srcParaNums'] + "]");
              const userId = request['user']["id"];

              debug("PUT /" + courseId + "/para/" + srcParaNums + "/move");
              //debug(request.body);

              const trgParaNum = request.body['trgParaNum'];
              //debug(trgParaNum);

              UserService.checkUserRightAndRespond(userId, EditRightType.EditCourse, courseId, response, () => {

                // Search the course
                Course
                  .findById(courseId)
                  .then(course => {

                    // calculate src
                    let srcParentPartNums = srcParaNums.slice(0, -2);
                    let srcParentParts = course.parts;
                    if (srcParentPartNums.length > 0) {
                      srcParentParts = CourseService.searchPartByPath(srcParentPartNums, srcParentParts).parts;
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
                    Course
                      .updateOrCreate(course)
                      .then(() => {
                        //debug(course);
                        _respondWithCoursePart(courseId, null, srcParaNums.slice(0, -1), userId, response);
                      })
                      .catch(err => {
                        console.log(err);
                        response.status(500).json({status: 500, message: "System error " + err});
                      })

                  })
                  .catch(err => {
                    console.log(err);
                    response.status(500).json({status: 500, message: "System error " + err});
                  });
              });

            });

courseRouter.route('/:course_id/para/:trgParaNums/add')
            // ============================================
            // add a course paragraph
            // ============================================
            .put((request: Request, response: Response) => {

              const courseId = request.params['course_id'];
              const trgParaNums = JSON.parse("[" + request.params['trgParaNums'] + "]");
              const userId = request['user']["id"];

              debug("PUT /" + courseId + "/para/" + trgParaNums + "/add");
              //debug(request.body);

              let type: ParagraphType = request.body.type;
              let subType: ParagraphContentType = request.body['subType'];

              UserService.checkUserRightAndRespond(userId, EditRightType.EditCourse, courseId, response, () => {

                // Search the course
                Course
                  .findById(courseId)
                  .then(course => {

                    // calculate trg
                    let trgParentPartNums = trgParaNums.slice(0, -2);
                    if (course.parts == null) {
                      course.parts = [];
                    }
                    let trgParentParts = course.parts;
                    if (trgParentPartNums.length > 0) {
                      let part = CourseService.searchPartByPath(trgParentPartNums, trgParentParts);
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
                    let paragraph: IParagraph = ParagraphService.getNewParagraph(type, subType);

                    //debug(paragraph);

                    // add the part to the trg
                    trgParentPart.contents.splice(trgParaIndex, 0, paragraph);

                    // Save the course
                    Course
                      .updateOrCreate(course)
                      .then(() => {
                        //debug(course);
                        _respondWithCoursePart(courseId, null, trgParaNums.slice(0, -1), userId, response);
                      })
                      .catch(err => {
                        console.log(err);
                        response.status(500).json({status: 500, message: "System error " + err});
                      })

                  })
                  .catch(err => {
                    console.log(err);
                    response.status(500).json({status: 500, message: "System error " + err});
                  });
              });

            });

courseRouter.route('/:course_id/part/:partNums')
            // ============================================
            // update a course part (a page)
            // ============================================
            .put((request: Request, response: Response) => {

              const courseId = request.params['course_id'];
              const partNums = JSON.parse("[" + request.params['partNums'] + "]");
              const userId = request['user']["id"];

              debug("PUT /" + courseId + "/part/" + partNums);
              //debug(request.body);

              const coursePart = new ICoursePart(request.body);
              //(coursePart);

              UserService.checkUserRightAndRespond(userId, EditRightType.EditCourse, courseId, response, () => {

                // Search the userValues
                Course
                  .findById(courseId)
                  .then(course => {

                    let parentPartNums = partNums.slice(0, -1);

                    let parentParts = course.parts;
                    if (parentPartNums.length > 0) {
                      parentParts = CourseService.searchPartByPath(parentPartNums, parentParts).parts;
                    }

                    let partIndex = partNums[partNums.length - 1];

                    if (coursePart['_id'] == null) {
                      // new page, add it
                      parentParts.splice(partIndex, 0, coursePart);
                    } else {
                      // replace the page
                      parentParts.splice(partIndex, 1, coursePart);
                    }

                    // Save the course
                    Course
                      .updateOrCreate(course)
                      .then(() => {
                        //debug(course);
                        _respondWithCoursePart(courseId, coursePart['_id'], partNums, userId, response);
                      })
                      .catch(err => {
                        console.log(err);
                        response.status(500).json({status: 500, message: "System error " + err});
                      })

                  })
                  .catch(err => {
                    console.log(err);
                    response.status(500).json({status: 500, message: "System error " + err});
                  });
              });

            })
            // ============================================
            // remove a course part (a page)
            // ============================================
            .delete((request: Request, response: Response) => {

              const courseId = request.params['course_id'];
              const partNums = JSON.parse("[" + request.params['partNums'] + "]");
              const userId = request['user']["id"];

              debug("DEL /" + courseId + "/part/" + partNums);

              UserService.checkUserRightAndRespond(userId, EditRightType.EditCourse, courseId, response, () => {

                // Search the course
                Course
                  .findById(courseId)
                  .then(course => {

                    let parentPartNums = partNums.slice(0, -1);

                    let parentParts = course.parts;
                    if (parentPartNums.length > 0) {
                      parentParts = CourseService.searchPartByPath(parentPartNums, parentParts).parts;
                    }

                    let partIndex = partNums[partNums.length - 1];

                    // remove the part
                    parentParts.splice(partIndex, 1);

                    // Save the course
                    Course
                      .updateOrCreate(course)
                      .then(() => {
                        //debug(course);
                        _respondWithCourse(courseId, userId, response);
                      })
                      .catch(err => {
                        console.log(err);
                        response.status(500).json({status: 500, message: "System error " + err});
                      })

                  })
                  .catch(err => {
                    console.log(err);
                    response.status(500).json({status: 500, message: "System error " + err});
                  });
              });

            });

courseRouter.route('/:course_id/part/:srcPartNums/move')
            // ============================================
            // move a course part (a page)
            // ============================================
            .put((request: Request, response: Response) => {

              const courseId = request.params['course_id'];
              const srcPartNums = JSON.parse("[" + request.params['srcPartNums'] + "]");
              const userId = request['user']["id"];

              debug("PUT /" + courseId + "/part/" + srcPartNums + "/move");
              //debug(request.body);

              const trgPartNums = request.body;
              //debug(trgPartNums);

              UserService.checkUserRightAndRespond(userId, EditRightType.EditCourse, courseId, response, () => {

                // Search the course
                Course
                  .findById(courseId)
                  .then(course => {

                    // calculate src
                    let srcParentPartNums = srcPartNums.slice(0, -1);
                    let srcParentParts = course.parts;
                    if (srcParentPartNums.length > 0) {
                      srcParentParts = CourseService.searchPartByPath(srcParentPartNums, srcParentParts).parts;
                    }
                    let srcPartIndex = srcPartNums[srcPartNums.length - 1];

                    // calculate trg
                    let trgParentPartNums = trgPartNums.slice(0, -1);
                    let trgParentParts = course.parts;
                    if (trgParentPartNums.length > 0) {
                      trgParentParts = CourseService.searchPartByPath(trgParentPartNums, trgParentParts).parts;
                    }
                    let trgPartIndex = trgPartNums[trgPartNums.length - 1];

                    // remove the part from the src
                    let coursePart = srcParentParts.splice(srcPartIndex, 1)[0];

                    // add the part to the trg
                    trgParentParts.splice(trgPartIndex, 0, coursePart);

                    // Save the course
                    Course
                      .updateOrCreate(course)
                      .then(() => {
                        //debug(course);
                        _respondWithCourse(courseId, userId, response);
                      })
                      .catch(err => {
                        console.log(err);
                        response.status(500).json({status: 500, message: "System error " + err});
                      })

                  })
                  .catch(err => {
                    console.log(err);
                    response.status(500).json({status: 500, message: "System error " + err});
                  });
              });

            });

courseRouter.route('/:course_id/part/:trgPartNums/add')
            // ============================================
            // add a course part (a page)
            // ============================================
            .put((request: Request, response: Response) => {

              const courseId = request.params['course_id'];
              const trgPartNums = JSON.parse("[" + request.params['trgPartNums'] + "]");
              const userId = request['user']["id"];

              debug("PUT /" + courseId + "/part/" + trgPartNums + "/add");
              //debug(request.body);

              UserService.checkUserRightAndRespond(userId, EditRightType.EditCourse, courseId, response, () => {

                // Search the course
                Course
                  .findById(courseId)
                  .then(course => {

                    // calculate trg
                    let trgParentPartNums = trgPartNums.slice(0, -1);
                    if (course.parts == null) {
                      course.parts = [];
                    }
                    let trgParentParts = course.parts;
                    if (trgParentPartNums.length > 0) {
                      let part = CourseService.searchPartByPath(trgParentPartNums, trgParentParts);
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
                    let coursePart = new ICoursePart({
                      title: "New page",
                      parts: [],
                      contents: []
                    });
                    coursePart.contents = [
                      new IParagraph({
                        type: ParagraphType.MarkDown,
                        content: ""
                      })
                    ];

                    // add the part to the trg
                    trgParentParts.splice(trgPartIndex, 0, coursePart);

                    // Save the course
                    Course
                      .updateOrCreate(course)
                      .then(() => {
                        //debug(course);
                        _respondWithCourse(courseId, userId, response);
                      })
                      .catch(err => {
                        console.log(err);
                        response.status(500).json({status: 500, message: "System error " + err});
                      })

                  })
                  .catch(err => {
                    console.log(err);
                    response.status(500).json({status: 500, message: "System error " + err});
                  });
              });

            });

courseRouter.route('/:course_id/:paragraph_id/userChoice')
            // ============================================
            // update user choice for a course paragraph
            // ============================================
            .put((request: Request, response: Response) => {

              const courseId = request.params['course_id'];
              const paragraphId = request.params['paragraph_id'];
              const userId = request['user']["id"];

              debug("PUT /" + courseId + "/" + paragraphId + "/userChoice");
              //debug(request.body);

              const userChoice = new UserChoice(request.body);
              // debug(userChoice);

              // Sort the user choice to be sure it could be compared to answer
              if (userChoice.userChoice instanceof Array) {
                userChoice.userChoice = userChoice.userChoice.sort();
              }

              // Search the userValues
              UserCourse.findByUserIdCourseId(userId, courseId)
                        .then(userCourse => {
                          //debug(userCourse);
                          //debug(userCourse.userChoices[paragraphId]);
                          if (userCourse == null) {
                            userCourse = new UserCourse({courseId: courseId, userId: userId});
                          }
                          if (userCourse.userChoices == null) {
                            userCourse.userChoices = {};
                          }
                          if (userCourse.userChoices[paragraphId] == null) {
                            userCourse.userChoices[paragraphId] = new IUserChoices()
                          }

                          _.assign(userCourse.userChoices[paragraphId], userChoice);
                          if (!userCourse.userChoices[paragraphId].userCheckCount) {
                            userCourse.userChoices[paragraphId].userCheckCount = 0;
                          }
                          userCourse.userChoices[paragraphId].updated = new Date();
                          //debug(userCourse.userChoices[paragraphId]);


                          CourseService.calcProgression(userCourse)
                                       .then((userCourse) => {
                                         UserCourse
                                           .updateOrCreate(userCourse)
                                           .then(() => {

                                             StatService.calcStatsUser(userId);

                                             _respondWithCourseParagraph(courseId, paragraphId, null, userId, response)
                                           })
                                           .catch(err => {
                                             console.log(err);
                                             response.status(500).json({status: 500, message: "System error " + err});
                                           });
                                       })
                                       .catch(err => {
                                         console.log(err);
                                         response.status(500).json({status: 500, message: "System error " + err});
                                       });
                        })
                        .catch(err => {
                          console.log(err);
                          response.status(500).json({status: 500, message: "System error " + err});
                        });

            });

courseRouter.route('/:course_id/:paragraph_id/userChoice/check')
            // ============================================
            // check user choice for a course paragraph
            // ============================================
            .put((request: Request, response: Response) => {

              const courseId = request.params['course_id'];
              const paragraphId = request.params['paragraph_id'];
              const userId = request['user']["id"];

              debug("PUT /" + courseId + "/" + paragraphId + "/userChoice/check'");
              //debug(request.body);

              const userChoice = new UserChoice(request.body);
              //debug(userChoice);

              // Search the user Values (to check if check can be done)
              UserCourse
                .findByUserIdCourseId(userId, courseId)
                .then(userCourse => {
                  userCourse = CourseService.initOrFillUserCourse(userCourse, courseId, userId, paragraphId, userChoice);

                  // get the paragraph
                  Course.findById(courseId)
                        .then(course => {
                          let paragraph = CourseService.searchParagraphById(paragraphId, course.parts);
                          if (paragraph != null) {

                            // check the user choice
                            ParagraphService
                              .checkUserChoice(userId, paragraph, userCourse.userChoices[paragraphId], response)
                              .then(job => {
                                if (job) {

                                  // Subscribe to jobRouter change
                                  JobService.subscribeJob(job.id, (j) => {

                                    //debug(j);

                                    userCourse.userChoices[paragraphId] = j.result;

                                    CourseService
                                      .calcProgression(userCourse)
                                      .then((userCourse) => {
                                        UserCourse
                                          .updateOrCreate(userCourse)
                                          .then(() => {
                                            StatService.calcStatsUser(userId);
                                          })
                                          .catch(err => {
                                            console.log(err);
                                          })
                                      })
                                  });

                                  // save it to Db
                                  CourseService
                                    .calcProgression(userCourse)
                                    .then((userCourse) => {
                                      UserCourse
                                        .updateOrCreate(userCourse)
                                        .then(() => {

                                          StatService.calcStatsUser(userId);

                                          //_respondWithCourseParagraph(courseId, paragraphId, null, request['user']["id"], response);
                                          response.json({data: job})
                                        })
                                        .catch(err => {
                                          console.log(err);
                                          response.status(500).json({status: 500, message: "System error " + err});
                                        })
                                    })
                                    .catch(err => {
                                      console.log(err);
                                      response.status(500).json({status: 500, message: "System error " + err});
                                    })
                                }
                              })
                              .catch(err => {
                                console.log(err);
                                response.status(500).json({status: 500, message: "System error " + err});
                              })
                          } else {
                            response.status(404).json({status: 404, message: "Course not found"});
                          }
                        })
                        .catch(err => {
                          console.log(err);
                          response.status(500).send("System error " + err);
                        });

                })
                .catch(err => {
                  console.log(err);
                  response.status(500).json({status: 500, message: "System error " + err});
                });

            });

courseRouter.route('/:course_id/:paragraph_id/userChoice/test')
            // ============================================
            // test user choice for a course paragraph : response : a Job
            // ============================================
            .put((request: Request, response: Response) => {

              const courseId = request.params['course_id'];
              const paragraphId = request.params['paragraph_id'];
              const userId = request['user']["id"];

              debug("PUT /" + courseId + "/" + paragraphId + "/userChoice/test'");
              //debug(request.body);

              const userChoice = new UserChoice(request.body);
              //debug(userChoice);

              // Search the user Values (to check if check can be done)
              UserCourse
                .findByUserIdCourseId(userId, courseId)
                .then(userCourse => {

                  userCourse = CourseService.initOrFillUserCourse(userCourse, courseId, userId, paragraphId, userChoice);
                  //debug(userCourse.userChoices[paragraphId]);

                  // get the paragraph
                  Course.findById(courseId)
                        .then(course => {
                          let paragraph = CourseService.searchParagraphById(paragraphId, course.parts);
                          if (paragraph != null) {
                            // check the user choice
                            ParagraphService
                              .testUserChoice(userId, paragraph, userCourse.userChoices[paragraphId], response)
                              .then(job => {

                                if (job) {

                                  // Subscribe to jobRouter change
                                  JobService.subscribeJob(job.id, (j) => {

                                    //debug(j);

                                    userCourse.userChoices[paragraphId] = j.result;

                                    UserCourse
                                      .updateOrCreate(userCourse)
                                      .then(() => {
                                        StatService.calcStatsUser(userId);
                                      })
                                      .catch(err => {
                                        console.log(err);
                                      })
                                  });

                                  // Subscribe to jobRouter change
                                  userCourse.userChoices[paragraphId] = job.result;
                                  // save it to Db
                                  CourseService
                                    .calcProgression(userCourse)
                                    .then((userCourse) => {
                                      UserCourse
                                        .updateOrCreate(userCourse)
                                        .then(() => {

                                          StatService.calcStatsUser(userId);

                                          //_respondWithCourseParagraph(courseId, paragraphId, null, request['user']["id"], response);
                                          response.json({data: job})

                                        })
                                        .catch(err => {
                                          console.log(err);
                                          response.status(500).json({status: 500, message: "System error " + err});
                                        })
                                    })
                                    .catch(err => {
                                      console.log(err);
                                      response.status(500).json({status: 500, message: "System error " + err});
                                    })
                                }
                              })
                              .catch(err => {
                                console.log(err);
                                response.status(500).json({status: 500, message: "System error " + err});
                              });

                          } else {
                            response.status(404).json({status: 404, message: "Course not found"});
                          }
                        })
                        .catch(err => {
                          console.log(err);
                          response.status(500).send("System error " + err);
                        });

                })
                .catch(err => {
                  console.log(err);
                  response.status(500).json({status: 500, message: "System error " + err});
                });

            });

/**
 * Get the courses list (for this user)
 * @param request
 * @param response
 * @private
 */
function _respondWithCoursesList(request: Request, response: Response) {
  let currentOnly = false;
  let progressOnly = false;
  if (request.query['currentOnly']) {
    currentOnly = (request.query['currentOnly'] === "true");
  }
  if (request.query['progressOnly']) {
    progressOnly = (request.query['progressOnly'] === "true");
  }

  //debug("_respondWithCoursesList "+currentOnly+" "+progressOnly);
  CourseService.getCourses(request['user']["id"], currentOnly, progressOnly)
               .then((completedCourses: ICourse[]) => {
                   response.json({data: completedCourses});
                 }
               )
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
function _respondWithCourse(courseId: string, userId: string, response: Response) {
  //debug("_respondWithCourse : " + courseId + ", " + userId);
  Course.findById(courseId)
        .then(course => {
          // Search the user
          User.findById(userId)
              .then(user => {
                if (course) {
                  CourseService.fillCourseForUser(course, user)
                               .then(cou => {
                                 //debug(cou);
                                 response.json({data: cou})
                               })
                               .catch(err => {
                                 console.log(err);
                                 response.status(500).send("System error " + err);
                               });
                } else {
                  response.status(404).json({status: 404, message: "Course not found"});
                }
              })
              .catch(err => {
                console.log(err);
                response.status(500).send("System error " + err);
              })
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
function _respondWithCourseParagraph(courseId: string, paragraphId: string, paragraphNums: number[], userId: string, response: Response) {
  //debug("_respondWithCourse : " + courseId + ", " + userId);
  Course.findById(courseId)
        .then(course => {

          // Search the user
          User.findById(userId)
              .then(user => {
                if (course) {
                  CourseService.fillCourseForUser(course, user)
                               .then(cou => {
                                 // search for the paragraph
                                 let para: IParagraph;
                                 if (paragraphId) {
                                   para = CourseService.searchParagraphById(paragraphId, cou.parts);
                                 } else {
                                   para = CourseService.searchParagraphByPath(paragraphNums, cou.parts);
                                 }

                                 if (para != null) {
                                   response.json({data: para})
                                 } else {
                                   response.status(404).json({status: 404, message: "Course not found"});
                                 }
                               })
                               .catch(err => {
                                 console.log(err);
                                 response.status(500).send("System error " + err);
                               });
                } else {
                  response.status(404).json({status: 404, message: "Course not found"});
                }
              })
              .catch(err => {
                console.log(err);
                response.status(500).send("System error " + err);
              })
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
function _respondWithCoursePart(courseId: string, coursePartId: string, partNums: number[], userId: string, response: Response) {
  //debug("_respondWithCoursePart : " + courseId + ", " + coursePartId+ ", " + partNums);
  Course.findById(courseId)
        .then(course => {

          // Search the user
          User.findById(userId)
              .then(user => {
                if (course) {
                  CourseService.fillCourseForUser(course, user)
                               .then(cou => {
                                 // search for the part
                                 let part: ICoursePart;
                                 if (coursePartId) {
                                   part = CourseService.searchPartById(coursePartId, cou.parts);
                                 } else {
                                   part = CourseService.searchPartByPath(partNums, cou.parts);
                                 }

                                 if (part != null) {
                                   response.json({data: part})
                                 } else {
                                   response.status(404).json({status: 404, message: "Page not found"});
                                 }
                               })
                               .catch(err => {
                                 console.log(err);
                                 response.status(500).send("System error " + err);
                               });
                } else {
                  response.status(404).json({status: 404, message: "Page not found"});
                }
              })
              .catch(err => {
                console.log(err);
                response.status(500).send("System error " + err);
              })
        })
        .catch(err => {
          console.log(err);
          response.status(500).send("System error " + err);
        });

}


export { courseRouter }





