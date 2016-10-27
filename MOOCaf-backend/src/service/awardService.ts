import * as _ from "lodash";

import Award from "../models/award";
import User = require("../models/user");
import UserCourse = require("../models/UserCourse");
import IUserPart = require("../models/iUserParts");

var debug = require('debug')('server:service:award');

export default class AwardService {



  static getAwards(userId: string): Promise <Award[]> {

    return new Promise<Award[]> ((resolve, reject) => {
      Award.find()
        .then(awards => {
          // Search the user
          User.findById(userId)
            .then(user => {
              //debug(user);
              // fill each award with users values
              var promises = _.map(awards,
                a => {
                  return AwardService.fillAwardForUser(a, user)
                });
              Promise.all(promises)
                .then(completedAwards => {
                  resolve(completedAwards)
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
   * fill award with user data
   * @param award
   * @param user (from Db, not from token... should be full)
   * @returns {Promise<Award>}
   * @private
   */
  static fillAwardForUser(award: Award, user: User): Promise < Award > {
    //debug("fillAwardForUser : " + award["id"] + ", " + user["id"]);


    return new Promise < Award >((resolve) => {

      // define the default values
      var userCount = 0;

      // get values from the user
      if (user && user.stats && user.stats[award.statKey.toString()]) {
        userCount = user.stats[award.statKey.toString()].userCount;
      }

      // assign the values into the award
      _.assign(award, {
        userCount: userCount,
        id: award['_id']
      });

      // work on the secret ones
      if (!user.isAdmin && award.secret && (award.limitCount > award.userCount)) {
        award.imgPath = "lock.svg";
        award.name = "? Secret ?";
        award.description = "Will still locked until you get it.";
      }

      resolve(award);

    })
  }



}
