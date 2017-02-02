import { Response } from "express";

import Paragraph = require("../models/paragraph");
import { ParagraphType } from "../models/eParagraphType";
import { IParagraph } from "../models/iParagraph";
import IUserChoices = require("../models/iUserChoices");

import { IParagraphService } from "./paragraph/iParagraphService";
import ParagraphFormService from "./paragraph/paragraphFormService";
import ParagraphTelnetService from "./paragraph/paragraphTelnetService";
import ParagraphMarkdownService from "./paragraph/paragraphMarkdownService";
import { Job } from "../models/job";
import ParagraphJavaService from "./paragraph/paragraphJavaService";

const debug = require('debug')('server:service:paragraph:debug');

export default class ParagraphService {


  /**
   * Get a new paragraph depending on it's type (and subtype)
   * @param paragraphType
   * @param subType
   * @returns {Paragraph}
   */
  static getNewParagraph(paragraphType: ParagraphType, subType: any): IParagraph {
    return ParagraphService._getClassForAType(paragraphType).getNewParagraph(subType)
  }


  /**
   * check a user choice in a paragraph (and respond if not allowed)
   * @param userId
   * @param paragraph
   * @param userChoice
   * @param response
   * @returns {Promise<Job>}
   */
  static checkUserChoice(userId: string, paragraph: IParagraph, userChoice: IUserChoices, response: Response): Promise<Job> {
    //debug({"checkUserChoice": paragraph});

    return new Promise<Job>((resolve) => {
      const ret = ParagraphService._checkIfOpenAndRespondOrAction(paragraph, userChoice, response);

      // Not open, already respond... do nothing else
      if (!ret) {
        resolve(null)
      } else {
        // Do the check
        ParagraphService
          ._getClassForAType(paragraph.type)
          .checkUserChoice(userId, paragraph, userChoice)
          .then((job) => {

            resolve(job);
          })
      }
    });
  }


  /**
   * test a user choice in a paragraph (and respond if not allowed)
   * @param userId
   * @param paragraph
   * @param userChoice
   * @param response
   * @returns {boolean}
   */
  static testUserChoice(userId: string, paragraph: IParagraph, userChoice: IUserChoices, response: Response): Promise<Job> {
    //debug("checkUserChoice");

    return new Promise<Job>((resolve, reject) => {
      const ret = ParagraphService._checkIfOpenAndRespondOrAction(paragraph, userChoice, response);
      // Not open, already respond... do nothing else
      if (!ret) {
        resolve(null)
      } else {
        // Do the test
        ParagraphService
          ._getClassForAType(paragraph.type)
          .testUserChoice(userId, paragraph, userChoice)
          .then((job) => {
            resolve(job);
          })
          .catch((err) => {
            //debug(err);
            reject(err);
          });
      }
    });
  }


  /**
   * If paragraph is Open, do the jobRouter, else respond
   * @param paragraph
   * @param userChoice
   * @param response
   * @returns {boolean}
   * @private
   */
  private static _checkIfOpenAndRespondOrAction(paragraph: IParagraph, userChoice: IUserChoices, response: Response): boolean {

    if (paragraph.maxCheckCount <= userChoice.userCheckCount) {
      // Too many try, won't be saved
      response.status(401).json({status: 401, message: "Too many try"});
      return false;

    } else if (userChoice.userCheckOK === true) {
      // Answer already correct
      response.status(401).json({status: 401, message: "Answer already correct"});
      return false;
    } else {
      return true;
    }

  }


  private static _getClassForAType(paragraphType: ParagraphType): IParagraphService {
    switch (paragraphType) {

      case ParagraphType.Form:
        return new ParagraphFormService();

      case ParagraphType.Telnet:
        return new ParagraphTelnetService();

      case ParagraphType.Java:
        return new ParagraphJavaService();

      case ParagraphType.MarkDown:
      default:
        return new ParagraphMarkdownService();
    }

  }
}