import Paragraph = require("../../models/paragraph");
import { ParagraphType } from "../../models/eParagraphType";
import { ParagraphContentType } from "../../models/eParagraphContentType";
import { IParagraph } from "../../models/iParagraph";
import IUserChoices = require("../../models/iUserChoices");
import { IParagraphService } from "./iParagraphService";
import { Job, JobStatus } from "../../models/job";
import JobService from "../jobService";

const debug = require('debug')('server:service:paragraph-form:debug');

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
  checkUserChoice(userId: string, paragraph: IParagraph, userChoice: IUserChoices): Promise<Job> {

    return new Promise<Job>( (resolve) => {

      // Do the check
      userChoice.userCheckOK = ("" + userChoice.userChoice == "" + paragraph.answer);

      userChoice.userCheckCount += 1;
      userChoice.updated = new Date();

      // if done, set it
      if ((userChoice.userCheckOK === true) || (paragraph.maxCheckCount <= userChoice.userCheckCount)) {
        userChoice.userDone = new Date();
        userChoice['answer'] = paragraph.answer;
      }

      resolve(JobService.createJob(null, JobStatus.Done, userChoice));
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