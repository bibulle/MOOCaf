import * as _ from "lodash";
import db from "./db";
import {ParagraphType} from "./eParagraphType";
import {ParagraphContentType} from "./eParagraphContentType";
import {ICourse, modelICourse} from "./iCourse";
import Mongoose = require("mongoose");
import {IParagraph} from "./iParagraph";
var Schema = Mongoose.Schema;
var debug = require('debug')('server:model:course');

export default class Course extends ICourse {

  /**
   * Constructor
   * @param mongoose.Document<ICourse>
   */
  constructor(document: {}) {
    super(document);
    modelICourse.on('error', function (err) {
      debug("Error : " + err);
    });
  }


  static count(): Promise<number> {
    //debug("count");
    return new Promise<number>((resolve, reject) => {
      modelICourse.count(
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
   * Find the list of courses
   * @returns {Promise<ICourse[]>}
   */
  static find(): Promise < Course[] > {
    // debug("find");
    return new Promise < ICourse[] >((resolve, reject) => {

      // Do the search
      modelICourse.find({})
        .lean()
        .exec()
        .then(
          (courses:ICourse[]) => {
            resolve(courses.map(f => {
              f['id'] = f['_id'].toString();
              return f;
            }));
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

  static findById(id: string): Promise < Course > {
    return new Promise < ICourse >((resolve, reject) => {
      modelICourse.findById(id)
        .lean()
        .exec()
        .then(
          (course: ICourse) => {
            //debug(course);
            course['id'] = course['_id'].toString();
            resolve(course);
          },
          err => {
            reject(err);
          });
    })
  }

  static updateOrCreate(course: Course): Promise < Course > {
    return new Promise < ICourse >((resolve, reject) => {

      //debug("updateOrCreate  id:" + course["_id"]);
      if (course["_id"]) {
        course.updated = new Date();
        modelICourse.findByIdAndUpdate(course["_id"], course)
          .lean()
          .exec()
          .then(
            (course: ICourse) => {
              course['id'] = course['_id'].toString();
              resolve(course);
            },
            err => {
              reject(err);
            });
      } else {
        modelICourse.create(course)
          .then(
            course => {
              course = course['_doc'];
              course['id'] = course['_id'].toString();
              resolve(course);
            },
            err => {
              reject(err);
            });
      }

    })
  }


}


