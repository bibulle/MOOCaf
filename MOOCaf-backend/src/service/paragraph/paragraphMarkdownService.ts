import Paragraph = require("../../models/paragraph");
import { ParagraphType } from "../../models/eParagraphType";
import { IParagraph } from "../../models/iParagraph";
import { IParagraphService } from "./iParagraphService";
import IUserChoices = require("../../models/iUserChoices");
var debug = require('debug')('server:service:paragraph-markdown');

export default class ParagraphMarkdownService implements IParagraphService {

  /**
   * Get a new paragraph depending on it's subtype
   * @returns {Paragraph}
   */
  getNewParagraph(): IParagraph {


    return new IParagraph({
      type: ParagraphType.MarkDown,
      content: 'content'
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
    // do nothing
    return false;
  }

  /**
   * Test a user choice in a paragraph (and respond if not allowed)
   *    The return value should set into the userChoice
   * @param paragraph
   * @param userChoice
   */
  testUserChoice(paragraph: IParagraph, userChoice: IUserChoices) {
    // do nothing
  }
}