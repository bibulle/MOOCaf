import {Router, Response, Request} from "express";
import * as jwt from "express-jwt";
import * as _ from "lodash";
import {secret} from "../config";
var debug = require('debug')('server:routes:course');
import Course from "../models/course";
import User = require("../models/user");
import UserChoice = require("../models/userChoice");
import isUndefined = require("lodash/isUndefined");
import IUserCourse = require("../models/iUserCourse");
import IUserChoices = require("../models/iUserChoices");
import Paragraph = require("../models/paragraph");
import {ICoursePart} from "../models/iCoursePart";
import {IParagraph} from "../models/iParagraph";


const courseRouter: Router = Router();

// Add JWT management
var jwtCheck = jwt({
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

    var currentOnly = false;
    if (request.query['currentOnly']) {
      currentOnly = (request.query['currentOnly'] === "true");
    }

    Course.find()
      .then(courses => {
        //debug(courses);
        // Search the user
        User.findById(request['user']["id"])
          .then(user => {
            // fill each paragraph with users values
            var promises = _.map(courses,
              p => _fillCourseForUser(p, user));
            Promise.all(promises)
              .then(completedCourses => {

                // filter if we only need the currents one
                if (currentOnly) {
                  completedCourses = completedCourses
                    .filter(f => {
                      return (f.dateFollowed && !f.dateFollowedEnd)
                    })
                }

                response.json({data: completedCourses})
              })
              .catch(err => {
                console.log(err);
                response.status(500).send("System error " + err);
              });
          })
          .catch(err => {
            //debug("find catch");
            console.log(err);
            response.status(500).send("System error " + err);
          });
      })
      .catch(err => {
        //debug("find catch");
        console.log(err);
        response.status(500).send("System error " + err);
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

    _getCourse(courseId, request['user']["id"], response);

  })

  // ====================================
  // update a course
  // ====================================
  .put((request: Request, response: Response) => {

    var course = new Course(request.body);
    //debug(course);
    //debug("PUT /" + request.params.course_id);

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


courseRouter.route('/:course_id/userValues')
// ====================================
// update user values for a course
// ====================================
  .put((request: Request, response: Response) => {

    var courseId = request.params.course_id;

    debug("PUT /" + courseId + "/userValues");
    //debug(request.body);

    // Search the user
    User.findById(request['user']["id"])
      .then(user => {
        //console.log(user);
        if (!user) {
          return response.status(404).json({status: 404, message: "User not found"});
        }

        if (!user.courses) {
          user.courses = {};
        }
        if (!user.courses[courseId]) {
          user.courses[courseId] = new IUserCourse();
        }

        user.courses[courseId].isFavorite = request.body.isFavorite;
        //console.log(user);

        // Save the user back to Db
        User.updateOrCreate(user)
          .then(user => {
            //console.log(user);

            _getCourse(courseId, request['user']["id"], response);
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

    //response.status(404).json({status: 404, message: "Course not found"});

  });

courseRouter.route('/:course_id/:paragraph_id/userChoice')
// ============================================
// update user choice for a course paragraph
// ============================================
  .put((request: Request, response: Response) => {

    var courseId = request.params.course_id;
    var paragraphId = request.params.paragraph_id;

    debug("PUT /" + courseId + "/" + paragraphId + "/userChoice");
    //debug(request.body);

    var userChoice = new UserChoice(request.body);
    //debug(userChoice);

    // Search the user
    User.findById(request['user']["id"])
      .then(user => {
        //console.log(user);
        if (!user) {
          return response.status(404).json({status: 404, message: "User not found"});
        }

        if (!user.courses) {
          user.courses = {};
        }
        if (!user.courses[courseId]) {
          user.courses[courseId] = new IUserCourse();
        }
        if (!user.courses[courseId].userChoices) {
          user.courses[courseId].userChoices = {};
        }
        if (!user.courses[courseId].userChoices[paragraphId]) {
          user.courses[courseId].userChoices[paragraphId] = new IUserChoices();
        }

        user.courses[courseId].userChoices[paragraphId].userChoice = userChoice.userChoice;
        user.courses[courseId].userChoices[paragraphId].updated = new Date();
        //console.log(user);

        // Save the user back to Db
        User.updateOrCreate(user)
          .then(user => {
            //debug(user);

            _getCourseParagraph(courseId, paragraphId, request['user']["id"], response);
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

courseRouter.route('/:course_id/:paragraph_id/userChoice/check')
// ============================================
// check user choice for a course paragraph
// ============================================
  .put((request: Request, response: Response) => {

    var courseId = request.params.course_id;
    var paragraphId = request.params.paragraph_id;

    debug("PUT /" + courseId + "/" + paragraphId + "/userChoice/check'");
    //debug(request.body);

    var userChoice = new UserChoice(request.body);
    //debug(userChoice);

    // Search the user (to check if check can be done)
    User.findById(request['user']["id"])
      .then(user => {
        //console.log(user);
        if (!user) {
          return response.status(404).json({status: 404, message: "User not found"});
        }

        if (!user.courses) {
          user.courses = {};
        }
        if (!user.courses[courseId]) {
          user.courses[courseId] = new IUserCourse();
        }
        if (!user.courses[courseId].userChoices) {
          user.courses[courseId].userChoices = {};
        }
        if (!user.courses[courseId].userChoices[paragraphId]) {
          user.courses[courseId].userChoices[paragraphId] = new IUserChoices();
        }

        user.courses[courseId].userChoices[paragraphId].userChoice = userChoice.userChoice;
        if (!user.courses[courseId].userChoices[paragraphId].userCheckCount) {
          user.courses[courseId].userChoices[paragraphId].userCheckCount = 0;
        }


        // get the paragraph
        Course.findById(courseId)
          .then(course => {
            let paragraph = _searchParagraph(paragraphId, course.parts);
            if (paragraph != null) {
              // check the user choice
              if (paragraph.maxCheckCount <= user.courses[courseId].userChoices[paragraphId].userCheckCount) {
                // Too many try, won't be saved
                response.status(401).json({status: 401, message: "To many try"});
              } else if (user.courses[courseId].userChoices[paragraphId].userCheckOK === true) {
                // Answer already correct
                response.status(401).json({status: 401, message: "Answer already correct"});
              } else {
                // Do the check
                user.courses[courseId].userChoices[paragraphId].userCheckOK = (""+user.courses[courseId].userChoices[paragraphId].userChoice == ""+paragraph.answer);
                user.courses[courseId].userChoices[paragraphId].userCheckCount += 1;
                user.courses[courseId].userChoices[paragraphId].updated = new Date();

                // save it to Db
                User.updateOrCreate(user)
                  .then(user => {
                    //debug(user);

                    _getCourseParagraph(courseId, paragraphId, request['user']["id"], response);
                  })
                  .catch(err => {
                    console.log(err);
                    response.status(500).json({status: 500, message: "System error " + err});
                  })
              }

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
 * fill course with user data
 * @param course
 * @param user (from Db, not from token... should be full)
 * @returns {Promise<Course>}
 * @private
 */
function _fillCourseForUser(course: Course, user: User): Promise < Course > {
  //debug("_fillCourseForUser : " + course["id"] + ", " + user["id"]);
  return new Promise < Course >((resolve) => {
    var f = course;

    // define the default values
    var isFavorite = false;
    var interest = 0;
    var dateFollowed = null;
    var dateFollowedEnd = null;
    var percentFollowed = 0;

    // get values from the user
    if (user && user.courses && user.courses[course["id"]]) {
      isFavorite = user.courses[course["id"]].isFavorite;
      interest = user.courses[course["id"]].interest;
      dateFollowed = user.courses[course["id"]].dateFollowed;
      dateFollowedEnd = user.courses[course["id"]].dateFollowedEnd;
      percentFollowed = user.courses[course["id"]].percentFollowed;

      // add user choices
      if (user.courses[course["id"]].userChoices) {

        _.forIn(user.courses[course["id"]].userChoices, (value, paragraphId) => {
          let p = _searchParagraph(paragraphId, f.parts);
          if (p) {
            //console.log(p);
            p.userChoice = value.userChoice;
            p.userCheckCount = value.userCheckCount;
            p.userCheckOK = value.userCheckOK;

            // remove the answer to not spoil !!
            if ((value.userCheckCount == null) || (value.userCheckCount < p.maxCheckCount)) {
              p.answer = null;
            }
          }
        })
      }
    }

    // assign the values into the course
    _.assign(f, {
      isFavorite: isFavorite,
      interest: interest,
      dateFollowed: dateFollowed,
      dateFollowedEnd: dateFollowedEnd,
      percentFollowed: percentFollowed,
      id: f['_id']
    });

    resolve(f);
  })
}
/**
 * Get a course (filled) by Id
 * @param courseId
 * @param userId
 * @param response
 * @private
 */
function _getCourse(courseId: string, userId: string, response) {
  //debug("_getCourse : " + courseId + ", " + userId);
  Course.findById(courseId)
    .then(course => {
      // Search the user
      User.findById(userId)
        .then(user => {
          if (course) {
            _fillCourseForUser(course, user)
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
 * Get a paragraph (filled) by Id
 * @param courseId
 * @param paragraphId
 * @param userId
 * @param response
 * @private
 */
function _getCourseParagraph(courseId: string, paragraphId: string, userId: string, response) {
  //debug("_getCourse : " + courseId + ", " + userId);
  Course.findById(courseId)
    .then(course => {

      // Search the user
      User.findById(userId)
        .then(user => {
          if (course) {
            _fillCourseForUser(course, user)
              .then(cou => {
                // search for the paragraph
                let para = _searchParagraph(paragraphId, cou.parts);
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
 * Search for a paragraphe within course parts
 * @param paragraphId
 * @param courseParts
 * @returns  the earched paragraph
 */
function _searchParagraph(paragraphId: string, courseParts: ICoursePart[]): IParagraph {

  let returnedParagraph: IParagraph = null;

  if (courseParts == null) {
    return null;
  }

  courseParts.forEach(part => {
    if (part.contents != null) {
      part.contents.forEach(para => {
        if (paragraphId == para['_id']) {
          returnedParagraph = para;
        }
      });
    }
    if (returnedParagraph == null) {
      returnedParagraph = _searchParagraph(paragraphId, part.parts);
    }
  });

  return returnedParagraph;

}


export {courseRouter}





