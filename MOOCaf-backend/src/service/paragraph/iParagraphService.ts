import { ParagraphContentType } from "../../models/eParagraphContentType";
import { IParagraph } from "../../models/iParagraph";
import IUserChoices = require("../../models/iUserChoices");


export interface IParagraphService {


  /**
   * Get a new paragraph depending on it's subtype
   * @param subType
   * @returns {Paragraph}
   */
  getNewParagraph(subType: ParagraphContentType): IParagraph;


  /**
   * Check a user choice in a paragraph (and respond if not allowed)
   *    The return value is ok or not
   * @param paragraph
   * @param userChoice
   * @returns {boolean}
   */
    checkUserChoice(paragraph: IParagraph, userChoice: IUserChoices): boolean;


  /**
   * Test a user choice in a paragraph (and respond if not allowed)
   *    The return value should set into the userChoice
   * @param paragraph
   * @param userChoice
   */
  testUserChoice(paragraph: IParagraph, userChoice: IUserChoices);
}