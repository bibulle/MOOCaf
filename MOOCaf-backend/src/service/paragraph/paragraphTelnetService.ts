import Paragraph = require("../../models/paragraph");
import { ParagraphType } from "../../models/eParagraphType";
import { IParagraph } from "../../models/iParagraph";
import IUserChoices = require("../../models/iUserChoices");
import { IParagraphService } from "./iParagraphService";
import { Client } from "ssh2";
import User = require("../../models/user");
import result = require("lodash/result");
import * as async from 'async';


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
   * @param userId
   * @param paragraph
   * @param userChoice
   * @returns {boolean}
   */
  checkUserChoice(userId: string, paragraph: IParagraph, userChoice: IUserChoices): Promise<boolean> {

    // TODO : implement this

    return new Promise<boolean>((resolve) => {
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

    var before = `mkdir foobar\n touch 'foobar/you_find_me_${(new Date()).getTime()}.tmp'; echo '---'`;
    var after = "cd $HOME ; rm -fr foobar; echo '---'";
    var separator = "-------------------------------" + (new Date()).getTime();

    var telnetResultBuilder = new TelnetResultBuilder(separator);

    var script = `
${before}
set -o history
${telnetResultBuilder.shellSeparatorIn}
${userChoice.userChoice}
${telnetResultBuilder.shellSeparatorOut}
set +o history
${after}`;


    return new Promise<void>((resolve, reject) => {
      var PASSWORD_CRYPT = '$6$Nuh5shGL$.lY2sRp2I8nnbykLl0zcj2K4L6BvaNSZLDb8x4y0DTC8QsnW85.tOBI9N.jtScY2DcHpSrUTV3GD.ANVKtkJs1';
      var PASSWORD_UN_CRYPT = 'foo';

      // Get user
      User.findById(userId)
          .then(user => {

            var connSystem = new Client();
            var connUser = new Client();

            var sshUser = `training_${user.username}`;

            var CREATE_USER_SCRIPT = `#set -x
          id -u ${sshUser} >/dev/null 2>&1
          if [ $? -eq 1 ]
          then
            sudo useradd ${sshUser} -p '${PASSWORD_CRYPT}' -m -s /bin/bash
          fi`;

            var systemStream = null;

            connSystem
              .on('ready', () => {
                //debug("connSystem : ready");

                // first test if user exist and create it if not
                connSystem
                  .exec(CREATE_USER_SCRIPT, (err, stream) => {
                    if (err) {
                      debug("ERR");
                      debug(err);
                      return connSystem.end();
                    }

                    systemStream = stream;

                    stream
                    //.on('close', function (code, signal) {
                      .on('close', function () {
                        //debug("close " + code + " " + signal);

                        // user ok... connect it
                        connUser.connect({
                          host: '10.71.68.175',
                          port: 22,
                          username: sshUser,
                          password: PASSWORD_UN_CRYPT,
                          //debug: (s) => { debug(s)}
                        });

                        connSystem.end();
                      })
                      .on('data', function () {
                        //debug('STDOUT: ' + data);
                      })
                      .stderr
                      .on('data', function () {
                        //debug('STDERR: ' + data);
                      });
                  });
              })
              .connect({
                host: '10.71.68.175',
                port: 22,
                username: 'ubuntu',
                privateKey: require('fs').readFileSync('/Users/martin/.ssh/teccbgdt.pem')
              });


            // When user will be connected... do the job
            connUser
              .on("ready", () => {

                // for each command, send it
                async.eachSeries(script.split("\n"), (s, callback) => {

                    telnetResultBuilder.addStdIn(s + "\n");
                    connUser.exec(s + "\n", (err, stream) => {
                      if (err) {
                        debug("ERR " + err);
                        callback(err);
                      }
                      stream.on('close', function (/*code, signal*/) {
                        //console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                        callback();

                      }).on('data', function (data) {
                        telnetResultBuilder.addStdOut(data);
                        //console.log('STDOUT: ' + data);
                      }).stderr.on('data', function (data) {
                        telnetResultBuilder.addStdErr(data);
                        //console.log('STDERR: ' + data);
                      });

                    });

                  },
                  err => {
                    if (err) {
                      debug("ERR " + err);
                      return;
                    }
                    debug("=========");
                    debug(telnetResultBuilder.getResult());
                    debug("=========");

                    userChoice.userChoiceReturn = telnetResultBuilder.getResult();
                    connUser.end();
                    resolve();
                  });


              })


          })
          .catch(err => {
            console.log(err);
            userChoice.userChoiceReturn = "System error " + err;
            reject(err);
          });
    });
  }

}

class TelnetResultBuilder {

  constructor(private separator: string) {

    this._separatorInRe = new RegExp(`^[\\s\\S]*IN${this.separator}.*[\r\n]*`, "m");
    this._separatorOutRe = new RegExp(`.*OUT${this.separator}[\\s\\S]*$`, "m");

    this._shellSeparatorIn = `echo 'IN${separator}'
                              echo 'IN${separator}' >&2`;
    this._shellSeparatorOut = `echo 'OUT${separator}'
                               echo 'OUT${separator}' >&2`

  }

  private _shellSeparatorIn: string;
  private _shellSeparatorOut: string;

  private _separatorInRe: RegExp;
  private _separatorOutRe: RegExp;

  private _result: string = "";
  private _stdInInDone = false;
  private _stdOutInDone = false;
  private _stdErrInDone = false;


  addStdOut(data: string | Buffer) {
    this._stdOutInDone = this._addResult(data, this._stdOutInDone, "out")
  }

  addStdIn(data: string | Buffer) {
    this._stdInInDone = this._addResult(data, this._stdInInDone, 'in')
  }

  addStdErr(data: string | Buffer) {
    this._stdErrInDone = this._addResult(data, this._stdErrInDone, "err")
  }

  getResult(): string {
    return this._result;
  }

  get shellSeparatorIn(): string {
    return this._shellSeparatorIn;
  }

  get shellSeparatorOut(): string {
    return this._shellSeparatorOut;
  }

  private _addResult(data: any, stdOutInDone: boolean, type: string): boolean {
    if (this._result.length > 1024 * 1024) {
      return false;
    }
    data = data.toString();
    if (data.toString().match(this._separatorInRe)) {
      stdOutInDone = true;
      data = data.replace(this._separatorInRe, "");
    }
    if (data.toString().match(this._separatorOutRe)) {
      stdOutInDone = false;
      data = data.replace(this._separatorOutRe, "");
    }
    if (stdOutInDone && (data != '')) {
      this._result += `<span class='${type}'>${data}</span>`;
    }
    return stdOutInDone;
  }


}
