import Paragraph = require("../../models/paragraph");
import { ParagraphType } from "../../models/eParagraphType";
import { IParagraph } from "../../models/iParagraph";
import IUserChoices = require("../../models/iUserChoices");
import { IParagraphService } from "./iParagraphService";


var debug = require('debug')('server:service:paragraph-telnet');

export default class ParagraphTelnetService implements IParagraphService {


  /**
   * Get a new paragraph depending on it's subtype
   * @returns {Paragraph}
   */
  getNewParagraph(): IParagraph {


    return new IParagraph({
      type: ParagraphType.Telnet,
      content: {
        label: 'Title',
        question: 'Question',
      },
      maxCheckCount: 3,
      answer: 'answer'
    });
  }


  /**
   * Check a user choice in a paragraph (and respond if not allowed)
   *    The return value is ok or not
   * @param paragraph
   * @param userChoice
   * @returns {boolean}
   */
  checkUserChoice(paragraph: IParagraph, userChoice: IUserChoices): boolean {

    // TODO : implement this

    return false;
  }

  /**
   * Test a user choice in a paragraph (and respond if not allowed)
   *    The return value should set into the userChoice
   * @param paragraph
   * @param userChoice
   */
  testUserChoice(paragraph: IParagraph, userChoice: IUserChoices) {
    // TODO : do something
  }

}