"use strict";
const db_1 = require("./db");
const iAward_1 = require("./iAward");
var debug = require('debug')('server:model:award');
class Award extends iAward_1.IAward {
    /**
     * Constructor
     * @param document
     */
    constructor(document) {
        super(document);
        iAward_1.modelIAward.on('error', function (err) {
            debug("Error : " + err);
        });
    }
    static count() {
        //debug("count");
        return new Promise((resolve, reject) => {
            iAward_1.modelIAward.count({}, (err, count) => {
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
     * Find the list of awards
     * @returns {Promise<IAward[]>}
     */
    static find() {
        //debug("find");
        return new Promise((resolve, reject) => {
            // Do the search
            iAward_1.modelIAward.find({})
                .lean()
                .exec()
                .then((awards) => {
                //debug(awards);
                resolve(awards.map(f => {
                    f['id'] = f['_id'].toString();
                    return f;
                }));
            }, err => {
                debug("find " + err);
                db_1.default.init();
                this.find()
                    .then(result => resolve(result))
                    .catch(err => reject(err));
            });
        });
    }
    /**
     * update or create an awrd (depending of id or not)
     * @param award
     * @returns {Promise<IAward>}
     */
    static updateOrCreate(award) {
        return new Promise((resolve, reject) => {
            //debug("updateOrCreate  id:" + award["_id"]);
            if (award["_id"]) {
                award.updated = new Date();
                iAward_1.modelIAward.findByIdAndUpdate(award["_id"], award, { 'new': true })
                    .lean()
                    .exec()
                    .then((award) => {
                    award['id'] = award['_id'].toString();
                    resolve(award);
                }, err => {
                    reject(err);
                });
            }
            else {
                iAward_1.modelIAward.create(award)
                    .then(award => {
                    award = award['_doc'];
                    award['id'] = award['_id'].toString();
                    resolve(award);
                }, err => {
                    reject(err);
                });
            }
        });
    }
    /**
     * Delete an awards
     * @param awardId
     * @returns {Promise<void>}
     */
    static remove(awardId) {
        //debug("remove");
        return new Promise((resolve, reject) => {
            // Do the search
            iAward_1.modelIAward.remove({ _id: awardId })
                .lean()
                .exec()
                .then(() => {
                resolve();
            }, err => {
                debug("remove " + err);
                reject(err);
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Award;
//# sourceMappingURL=award.js.map