"use strict";
const _ = require('lodash');
const course_1 = require("../models/course");
const User = require("../models/user");
const iCoursePart_1 = require("../models/iCoursePart");
const IUserPart = require("../models/iUserParts");
var debug = require('debug')('server:service:course');
class CourseService {
    static getCourses(userId, currentOnly, progressOnly) {
        return new Promise((resolve, reject) => {
            course_1.default.find()
                .then((courses) => {
                //debug(courses);
                // Search the user
                User.findById(userId)
                    .then(user => {
                    // fill each paragraph with users values
                    var promises = _.map(courses, p => CourseService.fillCourseForUser(p, user));
                    Promise.all(promises)
                        .then((completedCourses) => {
                        // filter if we only need the currents one
                        if (currentOnly) {
                            completedCourses = completedCourses
                                .filter(f => {
                                return (f.dateFollowed && !f.dateFollowedEnd);
                            });
                        }
                        else if (progressOnly) {
                            completedCourses = completedCourses
                                .filter(f => {
                                return (f.dateFollowed);
                            });
                        }
                        resolve(completedCourses);
                    })
                        .catch(err => {
                        reject(err);
                    });
                })
                    .catch(err => {
                    reject(err);
                });
            })
                .catch(err => {
                reject(err);
            });
        });
    }
    /**
     * fill course with user data
     * @param course
     * @param user (from Db, not from token... should be full)
     * @returns {Promise<Course>}
     * @private
     */
    static fillCourseForUser(course, user) {
        //debug("fillCourseForUser : " + course["id"] + ", " + user["id"]);
        return new Promise((resolve, reject) => {
            // as every course go there before being sen did just some verification
            // if no page... add one
            if (!course.parts) {
                course.parts = [];
            }
            if (course.parts.length == 0) {
                course.parts.push(new iCoursePart_1.ICoursePart({
                    title: "Not yet defined",
                    parts: [],
                    contents: []
                }));
                // Save the course
                course_1.default
                    .updateOrCreate(course)
                    .then(course => {
                    //debug(course);
                    CourseService.fillCourseForUser(course, user)
                        .then(course => {
                        resolve(course);
                    })
                        .catch(err => {
                        reject(err);
                    });
                })
                    .catch(err => {
                    console.log(err);
                    reject(err);
                });
            }
            else {
                // define the default values
                var isFavorite = false;
                var interest = 0;
                var dateSeen = null;
                var isNew = null;
                var dateFollowed = null;
                var dateFollowedEnd = null;
                var percentFollowed = 0;
                // get values from the user
                if (user && user.courses && user.courses[course["id"]]) {
                    isFavorite = user.courses[course["id"]].isFavorite;
                    interest = user.courses[course["id"]].interest;
                    dateSeen = user.courses[course["id"]].dateSeen;
                    isNew = user.courses[course["id"]].new;
                    dateFollowed = user.courses[course["id"]].dateFollowed;
                    dateFollowedEnd = user.courses[course["id"]].dateFollowedEnd;
                    percentFollowed = user.courses[course["id"]].percentFollowed;
                    if (dateSeen && isNew) {
                        isNew = ((dateSeen == null) || ((new Date().getTime() - dateSeen.getTime()) < 1000 * 60));
                    }
                    // add user choices for the paragraphs
                    if (user.courses[course["id"]].userChoices) {
                        _.forIn(user.courses[course["id"]].userChoices, (value, paragraphId) => {
                            let paragraph = CourseService.searchParagraphById(paragraphId, course.parts);
                            if (paragraph) {
                                //console.log(p);
                                paragraph.userChoice = value.userChoice;
                                paragraph.userCheckCount = value.userCheckCount;
                                paragraph.userCheckOK = value.userCheckOK;
                                paragraph.userDone = value.userDone;
                                // remove the answer to not spoil !!
                                if (!user.isAdmin && (value.userCheckCount == null) || (value.userCheckCount < paragraph.maxCheckCount)) {
                                    paragraph.answer = null;
                                }
                            }
                        });
                    }
                    // add user things about parts
                    if (user.courses[course["id"]].userParts) {
                        _.forIn(user.courses[course["id"]].userParts, (value, partId) => {
                            let part = CourseService.searchPartById(partId, course.parts);
                            if (part) {
                                //console.log(p);
                                part.lastDone = value.lastDone;
                                part.percentFollowed = (value.countRead + value.countCheckOk + value.countCheckKo) / value.countParagraph;
                                part.countRead = value.countRead;
                                part.countCheckOk = value.countCheckOk;
                                part.countCheckKo = value.countCheckKo;
                                part.countParagraph = value.countParagraph;
                            }
                        });
                    }
                }
                // assign the values into the course
                _.assign(course, {
                    isFavorite: isFavorite,
                    interest: interest,
                    dateSeen: dateSeen,
                    'new': isNew,
                    dateFollowed: dateFollowed,
                    dateFollowedEnd: dateFollowedEnd,
                    percentFollowed: percentFollowed,
                    id: course['_id']
                });
                resolve(course);
            }
        });
    }
    /**
     * Search for a paragraph within course parts
     * @param paragraphId
     * @param courseParts
     * @returns  the searched paragraph
     */
    static searchParagraphById(paragraphId, courseParts) {
        let returnedParagraph = null;
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
                returnedParagraph = CourseService.searchParagraphById(paragraphId, part.parts);
            }
        });
        return returnedParagraph;
    }
    /**
     * Search for a paragraph within course parts
     * @param paragraphNums
     * @param courseParts
     * @returns  the earched paragraph
     */
    static searchParagraphByPath(paragraphNums, courseParts) {
        let part = CourseService.searchPartByPath(paragraphNums.slice(0, -1), courseParts);
        let paraIndex = paragraphNums[paragraphNums.length - 1];
        return part.contents[paraIndex];
    }
    /**
     * Search for a part within course parts
     * @param partId
     * @param courseParts
     * @returns  the earched paragraph
     */
    static searchPartById(partId, courseParts) {
        let returnedPart = null;
        if (courseParts == null) {
            return null;
        }
        courseParts.forEach(part => {
            if (!returnedPart) {
                if (partId == part['_id']) {
                    returnedPart = part;
                }
                else {
                    returnedPart = CourseService.searchPartById(partId, part.parts);
                    if (returnedPart) {
                    }
                }
            }
        });
        return returnedPart;
    }
    /**
     * Search for a part within course parts
     * @param partNums
     * @param courseParts
     * @returns  the earched paragraph
     */
    static searchPartByPath(partNums, courseParts) {
        let part = courseParts[partNums[0]];
        for (let i = 1; i < partNums.length; i++) {
            part = part.parts[partNums[i]];
        }
        return part;
    }
    /**
     * Calc progression and stats for a user
     * @param userCourse
     * @private
     */
    static calcProgression(userCourse) {
        let courseId = userCourse.courseId;
        if (userCourse.userParts == null) {
            userCourse.userParts = {};
        }
        return new Promise((resolve, reject) => {
            course_1.default.findById(courseId)
                .then(course => {
                let courseCounts = CourseService._calcProgressionOnParts(course.parts, userCourse);
                // something as been done
                if (courseCounts.lastDone != null) {
                    // Let's start the course
                    if (!userCourse.dateFollowed) {
                        userCourse.dateFollowed = courseCounts.lastDone;
                    }
                    // Calculate the percent done
                    userCourse.percentFollowed = (courseCounts.countRead + courseCounts.countCheckOk + courseCounts.countCheckKo) / (courseCounts.countParagraph);
                    // Let's end it
                    if (userCourse.percentFollowed >= 1) {
                        userCourse.dateFollowedEnd = courseCounts.lastDone;
                    }
                    else {
                        userCourse.dateFollowedEnd = null;
                    }
                }
                resolve(userCourse);
            })
                .catch(err => {
                console.log(err);
                reject("System error " + err);
            });
        });
    }
    static _calcProgressionOnParts(parts, userCourse) {
        let ret = new IUserPart();
        ret.countParagraph = 0;
        ret.countCheckOk = 0;
        ret.countCheckKo = 0;
        ret.countRead = 0;
        _.forEach(parts, (part) => {
            let partId = part['_id'];
            // calculate on sub-parts
            userCourse.userParts[partId] = CourseService._calcProgressionOnParts(part.parts, userCourse);
            // add calculation on content
            _.forEach(part.contents, (paragraph) => {
                let paragraphId = paragraph['_id'];
                userCourse.userParts[partId].countParagraph++;
                if (userCourse.userChoices[paragraphId] && userCourse.userChoices[paragraphId].userDone) {
                    if (userCourse.userChoices[paragraphId].userCheckOK === true) {
                        userCourse.userParts[partId].countCheckOk++;
                    }
                    else if (userCourse.userChoices[paragraphId].userCheckOK === false) {
                        userCourse.userParts[partId].countCheckKo++;
                    }
                    else {
                        userCourse.userParts[partId].countRead++;
                    }
                    if (!userCourse.userParts[partId].lastDone || (userCourse.userParts[partId].lastDone < userCourse.userChoices[paragraphId].userDone)) {
                        userCourse.userParts[partId].lastDone = userCourse.userChoices[paragraphId].userDone;
                    }
                }
            });
            // add to the parent part
            ret.countParagraph += userCourse.userParts[partId].countParagraph;
            ret.countCheckOk += userCourse.userParts[partId].countCheckOk;
            ret.countCheckKo += userCourse.userParts[partId].countCheckKo;
            ret.countRead += userCourse.userParts[partId].countRead;
            if (!ret.lastDone || (ret.lastDone < userCourse.userParts[partId].lastDone)) {
                ret.lastDone = userCourse.userParts[partId].lastDone;
            }
        });
        // debug(userCourse.userParts);
        return ret;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CourseService;
//# sourceMappingURL=courseService.js.map