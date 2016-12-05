import { ParagraphContentType } from "../../models/eParagraphContentType";
import { IParagraph } from "../../models/iParagraph";
import IUserChoices = require("../../models/iUserChoices");
import { Job } from "../../models/job";



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
   * @param userId
   * @param paragraph
   * @param userChoice
   */
  checkUserChoice(userId: string, paragraph: IParagraph, userChoice: IUserChoices): Promise<Job>;


  /**
   * Test a user choice in a paragraph (and respond if not allowed)
   *    The return value should set into the userChoice
   * @param userId
   * @param paragraph
   * @param userChoice
   */
  testUserChoice(userId: string, paragraph: IParagraph, userChoice: IUserChoices): Promise<Job>;

}