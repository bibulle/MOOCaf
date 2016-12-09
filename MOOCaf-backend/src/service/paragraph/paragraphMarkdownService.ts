import Paragraph = require("../../models/paragraph");
import { ParagraphType } from "../../models/eParagraphType";
import { IParagraph } from "../../models/iParagraph";
import { IParagraphService } from "./iParagraphService";
import IUserChoices = require("../../models/iUserChoices");
import { Job } from "../../models/job";
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
  checkUserChoice(userId: string, paragraph: IParagraph, userChoice: IUserChoices): Promise<Job> {
    return new Promise<Job>( (resolve) => {
      // do nothing
      resolve(new Job({}));
    });
  }

  /**
   * Test a user choice in a paragraph (and respond if not allowed)
   *    The return value should set into the userChoice
   * @param userId
   * @param paragraph
   * @param userChoice
   */
  testUserChoice(userId: string, paragraph: IParagraph, userChoice: IUserChoices): Promise<Job> {
    return new Promise<Job>( (resolve) => {
      // do nothing
      resolve();
    });
  }
}