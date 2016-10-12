import Mongoose = require("mongoose");
import * as _ from 'lodash';
import UserCourse = require("./UserCourse");
import UserStats = require("./UserStats");

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
  constructor(document: {}) {
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
  constructor(document: {}) {
    super(document);
  }

  static count(): Promise<number> {
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
  static find(): Promise < User[] > {
    // debug("find");
    return new Promise < IUser[] >((resolve, reject) => {

      // Do the search
      _model.find({})
        .lean()
        .exec()
        .then(
          users => {
            resolve(users.map(f => {
              f.id = f._id.toString();
              return f;
            }));
          },
          err => {
            reject(err);
          })
      ;
    })
  }


  static findById(id: string): Promise < User > {
    return new Promise < IUser >((resolve, reject) => {
      _model.findById(id)
        .lean()
        .exec()
        .then(
          user => {
            if (!user) {
              reject("WRONG_USER");
            } else {
              user.id = user._id.toString();

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

  static findByUsername(userName: string): Promise < User > {
    return new Promise < IUser >((resolve, reject) => {
      _model.findOne({username: userName})
        .lean()
        .exec()
        .then(
          user => {
            if (user) {
              user.id = user._id.toString();
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

  static updateOrCreate(user: User): Promise < User > {
    return new Promise < User >((resolve, reject) => {

      //debug(user.courses['57eaa5673f918f13b01f2cac']);
      if (user["_id"]) {
        user.updated = new Date();
        _model.findByIdAndUpdate(user["_id"], user)
          .lean()
          .exec()
          .then(
            user => {
              user.id = user._id.toString();
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
              user.id = user._id.toString();
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
   * Fill the user with other data
   * @param user
   * @returns {Promise<IUser>}
   * @private
   */
  static _fillUser(user: User): Promise < User > {
    return new Promise < IUser >((resolve, reject) => {
      this._fillUserWithUserCourses(user)
        .then(user => {
          this._fillUserWithUserAwards(user)
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
   * Fill the user with user course values
   * @param user
   * @returns {Promise<IUser>}
   * @private
   */
  static _fillUserWithUserCourses(user: User): Promise < User > {
    return new Promise < IUser >((resolve, reject) => {
      UserCourse.findByUserId(user['id'])
        .then(courses => {
          user.courses = courses;
          resolve(user);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Fill a user with stats values
   * @param user
   * @returns {Promise<IUser>}
   * @private
   */
  static _fillUserWithUserAwards(user: User): Promise < User > {
    return new Promise < IUser >((resolve, reject) => {
      UserStats.findByUserId(user['id'])
        .then(stats => {
          user.stats = stats;
          resolve(user);
        })
        .catch(err => {
          reject(err);
        });
    });
  }



}

export = User;

