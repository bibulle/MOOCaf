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
   * @param userId
   * @param paragraph
   * @param userChoice
   * @returns {boolean}
   */
  checkUserChoice(userId: string, paragraph: IParagraph, userChoice: IUserChoices): Promise<boolean> {
    return new Promise<boolean>( (resolve) => {
      // do nothing
      resolve(false);
    });
  }

  /**
   * Test a user choice in a paragraph (and respond if not allowed)
   *    The return value should set into the userChoice
   * @param userId
   * @param paragraph
   * @param userChoice
   */
  testUserChoice(userId: string, paragraph: IParagraph, userChoice: IUserChoices): Promise<void> {
    return new Promise<void>( (resolve) => {
      // do nothing
      resolve();
    });
  }
}