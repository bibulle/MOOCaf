import Paragraph = require("../../models/paragraph");
import { ParagraphType } from "../../models/eParagraphType";
import { IParagraph } from "../../models/iParagraph";
import { IParagraphService } from "./iParagraphService";
import { Job, JobStatus } from "../../models/job";
import JobService from "../jobService";
import SshUtil from "../ssh/sshUtil";
import IUserChoices = require("../../models/iUserChoices");
import User = require("../../models/user");


const debug = require('debug')('server:service:paragraph-telnet:debug');

export default class ParagraphTelnetService implements IParagraphService {


  /**
   * Get a new paragraph depending on it's subtype
   * @returns {Paragraph}
   */
  getNewParagraph (): IParagraph {


    return new IParagraph({
      type: ParagraphType.Telnet,
      content: {
        before: "echo 'do something before'",
        after: "echo 'do something after'",
        label: 'This is the title of the question',
        question: 'What do you think ?\n\nSecond line',
        size: 20
      },
      maxCheckCount: 3,
      answer: 'answer'
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
  checkUserChoice (userId: string, paragraph: IParagraph, userChoice: IUserChoices): Promise<Job> {

    return new Promise<Job>((resolve, reject) => {

      this.testUserChoice(userId, paragraph, userChoice)
          .then(jobTest => {

            const jobCheck: Job = JobService.createJob(null, jobTest.status, jobTest.result);

            if (jobTest.status == JobStatus.Done) {

              // Do the check
              userChoice = jobTest.result;

              userChoice.userCheckOK = (userChoice.userChoiceReturn.indexOf(paragraph.answer) >= 0);

              userChoice.userCheckCount += 1;
              userChoice.updated = new Date();

              // if done, set it
              if ((userChoice.userCheckOK === true) || (paragraph.maxCheckCount <= userChoice.userCheckCount)) {
                userChoice.userDone = new Date();
                userChoice['answer'] = paragraph.answer;
              }

              JobService.updateJob(jobCheck.id, JobStatus.Continue, jobTest.result);

            } else {

              JobService.subscribeJob(jobTest.id, (j) => {

                JobService.updateJob(jobCheck.id, JobStatus.Continue, j.result);

                if (j.status == JobStatus.Done) {

                  // Do the check
                  userChoice = j.result;

                  userChoice.userCheckOK = (userChoice.userChoiceReturn.indexOf(paragraph.answer) >= 0);

                  userChoice.userCheckCount += 1;
                  userChoice.updated = new Date();

                  // if done, set it
                  if ((userChoice.userCheckOK === true) || (paragraph.maxCheckCount <= userChoice.userCheckCount)) {
                    userChoice.userDone = new Date();
                    userChoice['answer'] = paragraph.answer;
                  }

                  JobService.updateJob(jobCheck.id, j.status, j.result);
                }

              });
            }


            resolve(JobService.getJob(jobCheck.id));


          })
          .catch(err => {
            reject(err);
          })
    });
  }

  /**
   * Test a user choice in a paragraph (and respond if not allowed)
   *    The return value should set into the userChoice
   * @param userId
   * @param paragraph
   * @param userChoice
   */
  testUserChoice (userId: string, paragraph: IParagraph, userChoice: IUserChoices): Promise<Job> {

    debug('testUserChoice');

    const before = `${paragraph.content['before']}`;
    const after = `${paragraph.content['after']}`;
    const commandsBefore = `${before}`.split('\n');
    const commands = (userChoice.userChoice || "").split('\n');
    const commandsAfter = `${after}`.split('\n');




    return SshUtil.launch(commandsBefore, commands, commandsAfter, userId, userChoice);

   }

}

