import {Response} from "express";
import { randomBytes, pbkdf2 } from "crypto";
import { sign } from "jsonwebtoken";
import * as _ from "lodash";

import { secret, length, digest } from "../config";
import User = require("../models/user");


var debug = require('debug')('server:service:user');

export default class UserService {


  /**
   * Create e JWT token
   * @param user
   * @returns {string|void}
   */
  static createToken(user): string {
    return sign(_.pick(user, ['username', 'firstname', 'lastname', 'email', 'isAdmin', 'id']), secret, {expiresIn: "7d"});
  }

  /**
   * Generate a salt (for a user)
   * @returns {string}
   */
  static getSalt(): string {
    return randomBytes(128).toString("base64")
  }

  /**
   * Hash a password (to store in Db or compare with login stuff)
   * @param password
   * @param salt
   * @param callback
   */
  static createHash(password: string, salt: string, callback: (err: Error, derivedKey: Buffer) => any) {
    return pbkdf2(password, salt, 10000, length, digest, callback);
  }



  static checkUserRightAndRespond(userId: string, userRight: EditRightType, objectId: string, response: Response, actionIfOk: ()=>void) {
    UserService._isUserAllowed(userId, userRight, objectId)
               .then(allowed => {
                 if (!allowed) {
                   return response.status(403).json({status: 403, message: "Not authorized"});
                 } else {
                   actionIfOk()
                 }
               })
               .catch(err => {
                 console.log(err);
                 response.status(500).json({status: 500, message: "System error " + err});
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
  private static _isUserAllowed(userId: string, right: EditRightType, objectId: string): Promise<boolean> {
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
  private static _isUserAdmin(userId): Promise<boolean> {
    return new Promise((resolve, reject) => {
      User.findById(userId)
          .then(user => {
            resolve(user.isAdmin);
          })
          .catch(err=> {
            reject(err);
          });
    })
  }


}

export enum EditRightType {
  EditCourse,  EditAward, EditCoursesCatalogue
}
