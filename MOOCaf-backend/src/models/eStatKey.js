"use strict";
/*
  It's a string enum (so not really an enum
 */
class StatKey {
    constructor(value) {
        this.value = value;
    }
    toString() {
        return this.value;
    }
}
// Values
StatKey.COUNT_FINISHED_COURSE = new StatKey("COUNT_FINISHED_COURSE");
StatKey.COUNT_FINISHED_SURVEY = new StatKey("COUNT_FINISHED_SURVEY");
StatKey.MIN_FINISHED_COURSE_DURATION = new StatKey("MIN_FINISHED_COURSE_DURATION");
StatKey.MAX_FINISHED_COURSE_DURATION = new StatKey("MAX_FINISHED_COURSE_DURATION");
StatKey.MAX_PERCENT_GOOD_ANSWER = new StatKey("MAX_PERCENT_GOOD_ANSWER");
StatKey.COUNT_FINISHED_COURSE_CATEGORIES = new StatKey("COUNT_FINISHED_COURSE_CATEGORIES");
StatKey.MAX_COUNT_STARTED_COURSE_IN_PARALLEL = new StatKey("MAX_COUNT_STARTED_COURSE_IN_PARALLEL");
StatKey.COUNT_AWARDS = new StatKey("COUNT_AWARDS");
StatKey.COUNT_CREATED_COURSE = new StatKey("COUNT_CREATED_COURSE");
exports.StatKey = StatKey;
//# sourceMappingURL=eStatKey.js.map