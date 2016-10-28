import { Response } from "express";

import Paragraph = require("../models/paragraph");
import { ParagraphType } from "../models/eParagraphType";
import { IParagraph } from "../models/iParagraph";
import IUserChoices = require("../models/iUserChoices");

import { IParagraphService } from "./paragraph/iParagraphService";
import ParagraphFormService from "./paragraph/paragraphFormService";
import ParagraphTelnetService from "./paragraph/paragraphTelnetService";
import ParagraphMarkdownService from "./paragraph/paragraphMarkdownService";

var debug = require('debug')('server:service:paragraph');

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
   * @param paragraph
   * @param userChoice
   * @param response
   * @returns {boolean}
   */
  static checkUserChoice(paragraph: IParagraph, userChoice: IUserChoices, response: Response): boolean {
    //debug("checkUserChoice");

    return ParagraphService._checkIfOpenAndRespondOrAction(paragraph, userChoice, response, () => {
      // Do the check
      userChoice.userCheckOK = ParagraphService._getClassForAType(paragraph.type).checkUserChoice(paragraph, userChoice);

      userChoice.userCheckCount += 1;
      userChoice.updated = new Date();

      // if done, set it
      if ((userChoice.userCheckOK === true) || (paragraph.maxCheckCount <= userChoice.userCheckCount)) {
        userChoice.userDone = new Date();
      }
    });
  }


  /**
   * test a user choice in a paragraph (and respond if not allowed)
   * @param paragraph
   * @param userChoice
   * @param response
   * @returns {boolean}
   */
  static testUserChoice(paragraph: IParagraph, userChoice: IUserChoices, response: Response): boolean {
    //debug("checkUserChoice");

    return ParagraphService._checkIfOpenAndRespondOrAction(paragraph, userChoice, response, () => {
      // Do the test
      ParagraphService._getClassForAType(paragraph.type).testUserChoice(paragraph, userChoice);

    });
  }


  /**
   * If paragraph is Open, do the job, else respond
   * @param paragraph
   * @param userChoice
   * @param response
   * @param actionIfOpen
   * @returns {boolean}
   * @private
   */
  private static _checkIfOpenAndRespondOrAction(paragraph: IParagraph, userChoice: IUserChoices, response: Response, actionIfOpen: () => void): boolean {

    if (paragraph.maxCheckCount <= userChoice.userCheckCount) {
      // Too many try, won't be saved
      response.status(401).json({status: 401, message: "Too many try"});
      return false;

    } else if (userChoice.userCheckOK === true) {
      // Answer already correct
      response.status(401).json({status: 401, message: "Answer already correct"});
      return false;
    } else {

      actionIfOpen();

      return true;

    }

  }


  private static _getClassForAType(paragraphType: ParagraphType): IParagraphService {
    switch (paragraphType) {

      case ParagraphType.Form:
        return new ParagraphFormService();

      case ParagraphType.Telnet:
        return new ParagraphTelnetService();

      case ParagraphType.MarkDown:
      default:
        return new ParagraphMarkdownService();
    }

  }
}