"use strict";
const _ = require("lodash");
const award_1 = require("../models/award");
const User = require("../models/user");
var debug = require('debug')('server:service:award');
class AwardService {
    static getAwards(userId) {
        return new Promise((resolve, reject) => {
            award_1.default.find()
                .then(awards => {
                // Search the user
                User.findById(userId)
                    .then(user => {
                    //debug(user);
                    // fill each award with users values
                    var promises = _.map(awards, a => {
                        return AwardService.fillAwardForUser(a, user);
                    });
                    Promise.all(promises)
                        .then(completedAwards => {
                        resolve(completedAwards);
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
    static fillAwardForUser(award, user) {
        //debug("fillAwardForUser : " + award["id"] + ", " + user["id"]);
        return new Promise((resolve) => {
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
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AwardService;
//# sourceMappingURL=awardService.js.map