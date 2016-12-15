import Mongoose = require("mongoose");
import * as _ from 'lodash';
import UserCourse = require("./UserCourse");
import UserStats = require("./UserStats");
import Course from "./course";

var debug = require('debug')('server:model:user');

class IUser {
  username: string;
  firstname: string;
  lastname: string;
  email: string;

  hashedPassword: string;
  salt: string;

  isAdmin: boolean;

  created: Date;
  updated: Date;

  courses: { [id: string]: UserCourse };
  stats: { [statKey: string]: UserStats };

  /**
   * Constructor
   * @param document
   */
  constructor (document: {}) {
    _.merge(this, document);
  }
}

interface IUserModel extends IUser, Mongoose.Document {
}

/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
var _schema: Mongoose.Schema = new Mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  firstname: {
    type: String,
    require: true
  },
  lastname: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  hashedPassword: {
    type: String,
    require: true
  },
  salt: {
    type: String,
    require: true
  },
  isAdmin: {
    type: Boolean,
    require: false
  },
  created: {
    type: Date,
    'default': Date.now
  },
  updated: {
    type: Date,
    'default': Date.now
  }

})
  .pre('save', function (next) {
    this.updated = new Date();
    next();
  });

/**
 * Mongoose.Model
 * @type {Model<IUser>}
 * @private
 */
var _model = Mongoose.model < IUserModel >('User', _schema);

class User extends IUser {

  /**
   * Constructor
   * @param document
   */
  constructor (document: {}) {
    super(document);
  }

  static count (): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      _model.count(
        {},
        (err, count) => {
          err ? reject(err) : resolve(count);
        });
    })
  };

  /**
   * Find the list of user
   * @returns {Promise<IUser[]>}
   */
  static find (): Promise < User[] > {
    // debug("find");
    return new Promise < IUser[] >((resolve, reject) => {

      // Do the search
      _model.find({})
            .lean()
            .exec()
            .then(
              (users: IUser[]) => {
                resolve(users.map(f => {
                  f['id'] = f['_id'].toString();
                  return f;
                }));
              },
              err => {
                reject(err);
              })
      ;
    })
  }

  /**
   * Find the list of user (filled with stats and courses)
   * @returns {Promise<User[]>}
   */
  static findFilled (): Promise < User[] > {
    // debug("find");
    return new Promise < IUser[] >((resolve, reject) => {

      // Do the search
      _model.find({})
            .lean()
            .exec()
            .then(
              (users: IUser[]) => {

                var promises: Promise<IUser>[] = [];

                users.forEach(user => {
                  promises.push(
                    new Promise<IUser>((resolve, reject) => {
                      user['id'] = user['_id'].toString();
                      this._fillUser(user, true)
                          .then(u => {
                            u = user;

                            resolve(u);
                          })
                          .catch((err) => {
                            reject(err);
                          });
                    })
                  )
                });

                Promise.all(promises)
                       .then(v => {
                         resolve(v);
                       })
                       .catch(err => {
                         reject(err);
                       })


              },
              err => {
                reject(err);
              })
      ;
    })
  }


  static findById (id: string): Promise < User > {
    return new Promise < IUser >((resolve, reject) => {
      _model.findById(id)
            .lean()
            .exec()
            .then(
              (user: IUser) => {
                if (!user) {
                  reject("WRONG_USER");
                } else {
                  user['id'] = user['_id'].toString();

                  this._fillUser(user)
                      .then(user => {
                        resolve(user);
                      })
                      .catch(err => {
                        reject(err);
                      });
                }

              },
              err => {
                reject(err);
              });
    })
  }

  static findByUsername (userName: string): Promise < User > {
    return new Promise < IUser >((resolve, reject) => {
      _model.findOne({ username: userName })
            .lean()
            .exec()
            .then(
              (user: IUser) => {
                if (user) {
                  user['id'] = user['_id'].toString();
                  this._fillUser(user)
                      .then(user => {
                        resolve(user);
                      })
                      .catch(err => {
                        reject(err);
                      });
                } else {
                  resolve(user);
                }
              },
              err => {
                reject(err);
              });
    })
  }

  static updateOrCreate (user: User): Promise < User > {
    return new Promise < User >((resolve, reject) => {

      //debug(user.courses['57eaa5673f918f13b01f2cac']);
      if (user["_id"]) {
        user.updated = new Date();
        _model.findByIdAndUpdate(user["_id"], user)
              .lean()
              .exec()
              .then(
                (user: User) => {
                  user['id'] = user['_id'].toString();
                  this._fillUser(user)
                      .then(user => {
                        resolve(user);
                      })
                      .catch(err => {
                        reject(err);
                      });
                },
                err => {
                  reject(err);
                });
      } else {
        _model.create(user)
              .then(
                user => {
                  user = user['_doc'];
                  user['id'] = user['_id'].toString();
                  this._fillUser(user)
                      .then(user => {
                        resolve(user);
                      })
                      .catch(err => {
                        reject(err);
                      });
                },
                err => {
                  reject(err);
                });
      }
    });
  }


  /**
   * Fill the user with other data (and full with some courses and awards information)
   * @param user
   * @param full
   * @returns {Promise<IUser>}
   * @private
   */
  static _fillUser (user: User, full = false): Promise < User > {
    return new Promise < IUser >((resolve, reject) => {
      this._fillUserWithUserCourses(user, full)
          .then(user => {
            this._fillUserWithUserAwards(user, full)
                .then(user => {
                  resolve(user);
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
   * Fill the user with user course values (and full with some course information)
   * @param user
   * @param full
   * @returns {Promise<IUser>}
   * @private
   */
  static _fillUserWithUserCourses (user: User, full = false): Promise < User > {
    return new Promise < IUser >((resolve, reject) => {
      UserCourse.findByUserId(user['id'])
                .then(courses => {
                  user.courses = courses;

                  if (full) {
                    var promises: Promise<void>[] = [];

                    for (var courseId in user.courses) {
                      const _courseId = courseId;
                      promises.push(new Promise<void>((resolve, reject) => {
                        Course.findById(_courseId)
                              .then(course => {
                                _.merge(user.courses[_courseId], _.pick(course, ['name']));
                                resolve();
                              })
                              .catch(err => {
                                debug("catch1");
                                reject(err);
                              });
                      }));
                    }

                    Promise.all(promises)
                           .then(() => {
                             resolve(user);
                           })
                           .catch(err => {
                             debug(err);
                             reject(err);
                           })

                  } else {
                    resolve(user);
                  }

                })
                .catch(err => {
                  reject(err);
                });
    });
  }

  /**
   * Fill a user with stats values (and full with some awards information)
   * @param user
   * @param full
   * @returns {Promise<IUser>}
   * @private
   */
  static _fillUserWithUserAwards (user: User, full = false): Promise < User > {
    return new Promise < IUser >((resolve, reject) => {
      UserStats.findByUserId(user['id'])
               .then(stats => {
                 user.stats = stats;

                 for (var statId in user.stats) {
                   user.stats[statId]['name'] = statId.toLocaleLowerCase().replace(/_/g, ' ');
                   user.stats[statId]['name'] = user.stats[statId]['name'].charAt(0).toLocaleUpperCase()+user.stats[statId]['name'].slice(1);
                 }

                 if (full) {
                   // Nothing to do
                   resolve(user);
                 } else {
                   resolve(user);
                 }
               })
               .catch(err => {
                 reject(err);
               });
    });
  }


}

export = User;

