"use strict";
const async = require('async');
const courseService_1 = require("./courseService");
const awardService_1 = require("./awardService");
const UserStats = require("../models/UserStats");
const eStatKey_1 = require("../models/eStatKey");
var debug = require('debug')('server:service:stat');
class StatService {
    static calcStatsUser(userId) {
        // debug("calcStatsUser " + userId);
        this.q.push(userId, function (err) {
            if (err) {
                debug(err);
                debug.error(err);
            }
        });
        // debug("calcStatsUser " + userId + " done");
    }
    static _calcStatUser(userId) {
        // debug("_calcStatUser " + userId);
        var countFinishedCourse = new UserStats({ userId: userId, statKey: eStatKey_1.StatKey.COUNT_FINISHED_COURSE, userCount: 0 });
        var countFinishedSurvey = new UserStats({ userId: userId, statKey: eStatKey_1.StatKey.COUNT_FINISHED_SURVEY, userCount: 0 });
        var minFinishedCourseDuration = new UserStats({ userId: userId, statKey: eStatKey_1.StatKey.MIN_FINISHED_COURSE_DURATION, userCount: null });
        var maxFinishedCourseDuration = new UserStats({ userId: userId, statKey: eStatKey_1.StatKey.MAX_FINISHED_COURSE_DURATION, userCount: null });
        var maxPercentGoodAnswer = new UserStats({ userId: userId, statKey: eStatKey_1.StatKey.MAX_PERCENT_GOOD_ANSWER, userCount: 0 });
        var countFinishedCourseCategories = new UserStats({ userId: userId, statKey: eStatKey_1.StatKey.COUNT_FINISHED_COURSE_CATEGORIES, userCount: 0 });
        var maxCountStartedCourseInParallel = new UserStats({ userId: userId, statKey: eStatKey_1.StatKey.MAX_COUNT_STARTED_COURSE_IN_PARALLEL, userCount: 0 });
        var countAwards = new UserStats({ userId: userId, statKey: eStatKey_1.StatKey.COUNT_AWARDS, userCount: 0 });
        var countCreatedCourse = new UserStats({ userId: userId, statKey: eStatKey_1.StatKey.COUNT_CREATED_COURSE, userCount: 0 });
        // Works on sources
        courseService_1.default.getCourses(userId, false, false)
            .then(courses => {
            courses.forEach(course => {
                if (course.dateFollowedEnd) {
                    countFinishedCourse.userCount++;
                    // if (course.type == "Survey") {
                    //   countFinishedSurvey++;
                    // }
                    let courseDuration = course.dateFollowedEnd.getTime() - course.dateFollowed.getTime();
                    if (!minFinishedCourseDuration.userCount || (courseDuration < minFinishedCourseDuration.userCount)) {
                        minFinishedCourseDuration.userCount = courseDuration;
                    }
                    if (!maxFinishedCourseDuration.userCount || (courseDuration > maxFinishedCourseDuration.userCount)) {
                        maxFinishedCourseDuration.userCount = courseDuration;
                    }
                    let countGoodAnswer = 0;
                    let countWrongAnswer = 0;
                    course.parts.forEach(part => {
                        countGoodAnswer += part.countCheckOk;
                        countWrongAnswer += part.countCheckKo;
                    });
                    if ((countGoodAnswer + countWrongAnswer != 0) && (countGoodAnswer / (countGoodAnswer + countWrongAnswer) > maxPercentGoodAnswer.userCount)) {
                        maxPercentGoodAnswer.userCount = countGoodAnswer / (countGoodAnswer + countWrongAnswer);
                    }
                }
                else if (course.dateFollowed) {
                    maxCountStartedCourseInParallel.userCount++;
                }
            });
            // Save already calculated stats
            let promises = [
                UserStats.updateOrCreate(countFinishedCourse),
                UserStats.updateOrCreate(countFinishedSurvey),
                UserStats.updateOrCreate(minFinishedCourseDuration),
                UserStats.updateOrCreate(maxFinishedCourseDuration),
                UserStats.updateOrCreate(maxPercentGoodAnswer),
                UserStats.updateOrCreate(countFinishedCourseCategories),
                UserStats.updateOrCreate(maxCountStartedCourseInParallel),
                UserStats.updateOrCreate(countCreatedCourse),
            ];
            Promise.all(promises)
                .then(() => {
                awardService_1.default.getAwards(userId)
                    .then(awards => {
                    awards.forEach(award => {
                        if (award.limitCount <= award.userCount) {
                            countAwards.userCount++;
                        }
                    });
                    UserStats.updateOrCreate(countAwards)
                        .catch(err => {
                        console.log(err);
                    });
                });
            })
                .catch(err => {
                console.log(err);
            });
        });
    }
}
StatService.lastUserId = "";
StatService.lastCalc = new Date(0);
StatService.waitingList = {};
StatService.q = async.queue(function (userId, callback) {
    //debug("event received : " + userId);
    if ((StatService.lastUserId !== userId) || (new Date().getTime() - StatService.lastCalc.getTime() > 10000)) {
        StatService.lastUserId = userId;
        StatService.lastCalc = new Date();
        StatService._calcStatUser(userId);
    }
    else {
        if (!StatService.waitingList['userId']) {
            StatService.waitingList['userId'] = setTimeout(() => {
                delete StatService.waitingList['userId'];
                StatService._calcStatUser(userId);
            }, 2000);
        }
    }
    callback();
}, 1);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatService;
//# sourceMappingURL=statService.js.map