"use strict";
const crypto_1 = require("crypto");
const jsonwebtoken_1 = require("jsonwebtoken");
const _ = require("lodash");
const config_1 = require("../config");
const User = require("../models/user");
var debug = require('debug')('server:service:user');
class UserService {
    /**
     * Create e JWT token
     * @param user
     * @returns {string|void}
     */
    static createToken(user) {
        return jsonwebtoken_1.sign(_.pick(user, ['username', 'firstname', 'lastname', 'email', 'isAdmin', 'id']), config_1.secret, { expiresIn: "7d" });
    }
    /**
     * Generate a salt (for a user)
     * @returns {string}
     */
    static getSalt() {
        return crypto_1.randomBytes(128).toString("base64");
    }
    /**
     * Hash a password (to store in Db or compare with login stuff)
     * @param password
     * @param salt
     * @param callback
     */
    static createHash(password, salt, callback) {
        return crypto_1.pbkdf2(password, salt, 10000, config_1.length, config_1.digest, callback);
    }
    static checkUserRightAndRespond(userId, userRight, objectId, response, actionIfOk) {
        UserService._isUserAllowed(userId, userRight, objectId)
            .then(allowed => {
            if (!allowed) {
                return response.status(403).json({ status: 403, message: "Not authorized" });
            }
            else {
                actionIfOk();
            }
        })
            .catch(err => {
            console.log(err);
            response.status(500).json({ status: 500, message: "System error " + err });
        });
    }
    /**
     *
     * @param userId
     * @param right
     * @param objectId
     * @returns {Promise<boolean>}
     * @private
     */
    static _isUserAllowed(userId, right, objectId) {
        switch (right) {
            // this one should be different
            case EditRightType.EditCourse:
                return this._isUserAdmin(userId);
            case EditRightType.EditAward:
            case EditRightType.EditCoursesCatalogue:
            default:
                return this._isUserAdmin(userId);
        }
    }
    /**
     * is the user admin
     * @param userId
     * @returns {Promise<boolean>}
     * @private
     */
    static _isUserAdmin(userId) {
        return new Promise((resolve, reject) => {
            User.findById(userId)
                .then(user => {
                resolve(user.isAdmin);
            })
                .catch(err => {
                reject(err);
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserService;
(function (EditRightType) {
    EditRightType[EditRightType["EditCourse"] = 0] = "EditCourse";
    EditRightType[EditRightType["EditAward"] = 1] = "EditAward";
    EditRightType[EditRightType["EditCoursesCatalogue"] = 2] = "EditCoursesCatalogue";
})(exports.EditRightType || (exports.EditRightType = {}));
var EditRightType = exports.EditRightType;
//# sourceMappingURL=userService.js.map