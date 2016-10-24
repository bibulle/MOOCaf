"use strict";
const db_1 = require("./db");
const iCourse_1 = require("./iCourse");
const Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var debug = require('debug')('server:model:course');
class Course extends iCourse_1.ICourse {
    /**
     * Constructor
     * @param mongoose.Document<ICourse>
     */
    constructor(document) {
        super(document);
        iCourse_1.modelICourse.on('error', function (err) {
            debug("Error : " + err);
        });
    }
    static count() {
        //debug("count");
        return new Promise((resolve, reject) => {
            iCourse_1.modelICourse.count({}, (err, count) => {
                //debug("count " + err + " " + count);
                if (err) {
                    db_1.default.init();
                    this.count()
                        .then(result => resolve(result))
                        .catch(err => reject(err));
                }
                else {
                    resolve(count);
                }
            });
        });
    }
    ;
    /**
     * Find the list of courses
     * @returns {Promise<ICourse[]>}
     */
    static find() {
        // debug("find");
        return new Promise((resolve, reject) => {
            // Do the search
            iCourse_1.modelICourse.find({})
                .lean()
                .exec()
                .then((courses) => {
                resolve(courses.map(f => {
                    f['id'] = f['_id'].toString();
                    return f;
                }));
            }, err => {
                // debug("find " + err);
                db_1.default.init();
                this.find()
                    .then(result => resolve(result))
                    .catch(err => reject(err));
            });
        });
    }
    static findById(id) {
        return new Promise((resolve, reject) => {
            iCourse_1.modelICourse.findById(id)
                .lean()
                .exec()
                .then((course) => {
                //debug(course);
                course['id'] = course['_id'].toString();
                resolve(course);
            }, err => {
                reject(err);
            });
        });
    }
    static updateOrCreate(course) {
        return new Promise((resolve, reject) => {
            //debug("updateOrCreate  id:" + course["_id"]);
            if (course["_id"]) {
                course.updated = new Date();
                iCourse_1.modelICourse.findByIdAndUpdate(course["_id"], course)
                    .lean()
                    .exec()
                    .then((course) => {
                    course['id'] = course['_id'].toString();
                    resolve(course);
                }, err => {
                    reject(err);
                });
            }
            else {
                iCourse_1.modelICourse.create(course)
                    .then(course => {
                    course = course['_doc'];
                    course['id'] = course['_id'].toString();
                    resolve(course);
                }, err => {
                    reject(err);
                });
            }
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Course;
//# sourceMappingURL=course.js.map