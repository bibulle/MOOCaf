import Paragraph = require("../../models/paragraph");
import { ParagraphType } from "../../models/eParagraphType";
import { IParagraph } from "../../models/iParagraph";
import IUserChoices = require("../../models/iUserChoices");
import { IParagraphService } from "./iParagraphService";
import User = require("../../models/user");
import result = require("lodash/result");
import { Job, JobStatus } from "../../models/job";
import JobService from "../jobService";
import reject = require("lodash/reject");
import SshUtil from "../ssh/sshUtil";


const debug = require('debug')('server:service:paragraph-java:debug');

export default class ParagraphJavaService implements IParagraphService {


  /**
   * Get a new paragraph depending on it's subtype
   * @returns {Paragraph}
   */
  getNewParagraph (): IParagraph {


    return new IParagraph({
      type: ParagraphType.Java,
      content: {
        codeBefore: `class Toto {
  public static void main(String [] args) {
    `,
        codeAfter: `}`,
        actionBefore: "cd\n rm -fr test1\n mkdir test1\n cd test1",
        codeFileName: "toto.java",
        compileCommand: "javac toto.java",
        execCommand: "java -cp . Toto",
        actionAfter: "cd\n rm -fr test1",
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

    // Get all paragraph values
    const actionBefore = `${paragraph.content['actionBefore']}`;
    const actionAfter = `${paragraph.content['actionAfter']}`;

    const codeBefore = `${paragraph.content['codeBefore']}`;
    const codeAfter = `${paragraph.content['codeAfter']}`;
    const codeFileName = `${paragraph.content['codeFileName']}`;

    const compileCommand = `${paragraph.content['compileCommand']}`;
    const execCommand = `${paragraph.content['execCommand']}`;

    // Construct the code and the command to put it in a java file
    const fullCode = `
${codeBefore}
${userChoice.userChoice || ""}
${codeAfter}`;
    const codeScript = `echo '${fullCode.replace(/'/g, "'\"'\"'")}' > ${codeFileName}`;


    // Scripts to exec
    const commandsBefore = []
      .concat(actionBefore.split('\n'))
      .concat(codeScript);

    const commands = []
      .concat(compileCommand.split('\n'))
      .concat(execCommand.split('\n'));

    const commandsAfter = []
      .concat(actionAfter.split('\n'));


    return SshUtil.launch(commandsBefore, commands, commandsAfter, userId, userChoice);

  }


}
