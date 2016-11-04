import Paragraph = require("../../models/paragraph");
import { ParagraphType } from "../../models/eParagraphType";
import { ParagraphContentType } from "../../models/eParagraphContentType";
import { IParagraph } from "../../models/iParagraph";
import IUserChoices = require("../../models/iUserChoices");
import { IParagraphService } from "./iParagraphService";

var debug = require('debug')('server:service:paragraph-form');

export default class ParagraphFormService implements IParagraphService {

  /**
   * Get a new paragraph depending on it's subtype
   * @param subType
   * @returns {Paragraph}
   */
  getNewParagraph(subType: ParagraphContentType): IParagraph {


    switch (subType) {
      case ParagraphContentType.Text:
        return new IParagraph({
          type: ParagraphType.Form,
          content: {
            type: subType,
            label: 'Title',
            question: 'Question',
          },
          maxCheckCount: 3,
          answer: 'answer'
        });

      case ParagraphContentType.Radio:
        return new IParagraph({
          type: ParagraphType.Form,
          content: {
            type: subType,
            label: 'Title',
            questions: ['Choice 1', 'Choice 2'],
          },
          maxCheckCount: 3,
          answer: 0
        });

      case ParagraphContentType.Checkbox:
      default:
        return new IParagraph({
          type: ParagraphType.Form,
          content: {
            type: subType,
            label: 'Title',
            questions: ['Choice 1', 'Choice 2'],
          },
          maxCheckCount: 3,
          answer: [0]
        });
    }
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
      // Do the check
      resolve("" + userChoice.userChoice == "" + paragraph.answer);
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