/*
  It's a string enum (so not really an enum
 */
export class StatKey {

  // Values
  static COUNT_FINISHED_COURSE = new StatKey("COUNT_FINISHED_COURSE");
  static COUNT_FINISHED_SURVEY = new StatKey("COUNT_FINISHED_SURVEY");
  static MIN_FINISHED_COURSE_DURATION = new StatKey("MIN_FINISHED_COURSE_DURATION");
  static MAX_FINISHED_COURSE_DURATION = new StatKey("MAX_FINISHED_COURSE_DURATION");
  static MAX_PERCENT_GOOD_ANSWER = new StatKey("MAX_PERCENT_GOOD_ANSWER");
  static COUNT_FINISHED_COURSE_CATEGORIES = new StatKey("COUNT_FINISHED_COURSE_CATEGORIES");
  static MAX_COUNT_STARTED_COURSE_IN_PARALLEL = new StatKey("MAX_COUNT_STARTED_COURSE_IN_PARALLEL");
  static COUNT_AWARDS = new StatKey("COUNT_AWARDS");
  static COUNT_CREATED_COURSE = new StatKey("COUNT_CREATED_COURSE");


  constructor(public value: string) {

  }

  toString() {
    return this.value;
  }


}
