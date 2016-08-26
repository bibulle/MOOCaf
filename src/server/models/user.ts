import Mongoose = require("mongoose");
import * as _ from 'lodash';

var debug = require('debug')('server:model:user');


class IUser {
  username: string;
  hashedPassword: string;
  salt: string;
  isAdmin: boolean;
  created: Date;
  updated: Date;

  /**
   * Constructor
   * @param mongoose.Document<IUser>
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
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
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
   * @param mongoose.Document<IUser>
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

  static findById(id: string): Promise < User > {
    return new Promise < IUser >((resolve, reject) => {
      _model.findById(id)
        .exec()
        .onResolve((err, user) => {
          err ? reject(err) : resolve(user);
        });
    })
  }

  static findByUsername(userName: string): Promise < User > {
    return new Promise < IUser >((resolve, reject) => {
      _model.findOne({username: userName})
        .exec()
        .then(
          user => {
            resolve(user);
          },
          err => {
            reject(err);
          });
    })
  }

  static findOrCreate(user: User): Promise < User > {
    return new Promise < IUser >((resolve, reject) => {
      _model.findOne({id: user["_id"] || 'fakeone'})
        .exec()
        .then(foundUser => {
          if (foundUser) {
            return resolve(foundUser);
          }
          _model.create(user)
            .then(
              user => {
                debug("findOrCreate : after create " + user.username);
                resolve(user);
              },
              err => {
                debug("findOrCreate : after create " + err);
                reject(err);
              });
        });
    });
  }

}

export = User

// Init database if it's empty
User.count()
  .then(count => {
    if (count === 0) {
      var users: {}[] = [{
        username: 'eric',
        salt: '6MulWcxSt3p0BC4Xa59Xz9O8TUCu3VJE/cTwT2WOjws5XOnZhPfmj5Rku5EY8xzAgUDAgc5Z/6r1y6JLHtknmGINveNFJhadsAkFE+TS4EqI0Nzm8brPpZ3KZLHVLfF2tDBZtp9K5Z/l5WNOQkCFwEKaSzvbhnP+/i4hCZg2kyk=',
        hashedPassword: 'b80776ef82727b04f57f314a655a31e926d3ea664e7295445409ef113c04c55984082a076ffbff9df377e19d96667026d498ad9bbd4f6211d6da39d7bb0fae331ad08709928513618174bc5a216ca6b74c5fd8e21cbbae0e7e44e24b6ae1d71a24f4088f10ca3533e144df1d66b9300ace3196097cf933b0a5f234b283b0fce3',
        isAdmin: true
      }];
      _.forEach(users,
        o => {
          var user = new User(o);
          User.findOrCreate(user)
            .then(user => debug("User created : " + user.username))
            .catch(err => debug("Error creating user : " + err))
        });
    }
  })
  .catch(err => {
    console.log(err);
  });

