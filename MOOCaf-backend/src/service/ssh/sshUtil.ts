import { Job, JobStatus } from "../../models/job";
import User = require("../../models/user");
import * as async from 'async';
import JobService from "../jobService";
const SSH2Shell = require('ssh2shell');

const debug = require('debug')('server:service:ssh:debug');
const error = require('debug')('server:service:ssh:error');

/**
 * class to manage ssh connection to tenant unix system
 */
export default class SshUtil {

  // TODO : Add connection parameters to configuration
  private static _HOST = '10.71.68.175';
  private static _PORT = 22;
  private static _ROOT_USER = 'ubuntu';
  private static _PRIVATE_KEY = require('fs').readFileSync('./teccbgdt.pem');

  private static _PASSWORD_CRYPT = '$6$Nuh5shGL$.lY2sRp2I8nnbykLl0zcj2K4L6BvaNSZLDb8x4y0DTC8QsnW85.tOBI9N.jtScY2DcHpSrUTV3GD.ANVKtkJs1';
  private static _PASSWORD_UN_CRYPT = 'foo';


  /**
   * Launch the commands through ssh and return result in a Job result
   * @param _commandsBefore commands to launch before the user commands (result won't be shown)
   * @param _commandsAsked commands asked by the user
   * @param _commandsAfter commands to launch after the user commands (result won't be shown)
   * @param userId the user asking (to get separate environment for users)
   * @param userChoice the user choices object (to update the result)
   * @returns {Promise<Job>}
   */
  static launch (_commandsBefore: string[], _commandsAsked: string[], _commandsAfter: string[], userId: string, userChoice) {

    const telnetResultBuilder = new TelnetResultBuilder();

    // Commands must be split (no \n inside)
    let commandsBefore = [];
    let commandsAsked = [];
    let commandsAfter = [];
    _commandsBefore.forEach((command) => {
      commandsBefore = commandsBefore.concat(command.split('\n').filter((command) => { return command != ''}));
    });
    _commandsAsked.forEach((command) => {
      commandsAsked = commandsAsked.concat(command.split('\n').filter((command) => { return command != ''}));
    });
    _commandsAfter.forEach((command) => {
      commandsAfter = commandsAfter.concat(command.split('\n').filter((command) => { return command != ''}));
    });


    return new Promise<Job>((resolve, reject) => {

      userChoice.userChoiceReturn = telnetResultBuilder.getResult();
      const job: Job = JobService.createJob(null, JobStatus.Continue, userChoice);
      resolve(job);


      // Get the user
      User.findById(userId)
          .then(user => {

            // The user that is going to be created on the unix machine
            const sshUser = `training_${user.username}`;

            async.series(
              [
                // ------------------
                // First create the training user if it do not exists
                // ------------------
                (callback) => {
                  const host = {
                    server: {
                      host: SshUtil._HOST,
                      port: SshUtil._PORT,
                      userName: SshUtil._ROOT_USER,
                      privateKey: SshUtil._PRIVATE_KEY,
                      debug: false
                    },
                    debug: false,
                    idleTimeOut: 5000,
                    commands: [
                      `#set -x`,
                      `id -u ${sshUser} >/dev/null 2>&1`,
                      `if [ $? -eq 1 ]`,
                      `then`,
                      `  echo "create ${sshUser}"`,
                      `  sudo useradd ${sshUser} -p '${SshUtil._PASSWORD_CRYPT}' -m -s /bin/bash`,
                      `  sudo ed /etc/ssh/sshd_config <<< $'H\\n,s/PasswordAuthentication no/PasswordAuthentication yes/\\nw'`,
                      `  sudo service ssh restart`,
                      `fi`,
                    ],
                    msg: {
                      send: (message) => {
                        debug(message);
                      }
                    },
                    onError: (err) => {
                      callback(err);
                    },
                    onEnd: () => {
                      callback();
                    }
                  };

                  //debug(host.commands);

                  const sshSystem = new SSH2Shell(host);
                  sshSystem.connect();

                },

                // ------------------
                // Do the job
                // ------------------
                (callback) => {
                  const commands = [].concat("set -o history")
                                     .concat(commandsBefore)
                                     .concat("set -o history")
                                     .concat(telnetResultBuilder.shellSeparatorIn)
                                     .concat(commandsAsked)
                                     .concat(telnetResultBuilder.shellSeparatorOut)
                                     .concat("set -o history")
                                     .concat(commandsAfter);

                  //debug(commands);

                  //noinspection JSUnusedGlobalSymbols
                  const host = {
                    server: {
                      host: SshUtil._HOST,
                      port: SshUtil._PORT,
                      userName: sshUser,
                      password: SshUtil._PASSWORD_UN_CRYPT,
                      debug: false,
                      options: { term: 'xterm-256color', rows: 48, cols: 160 }
                    },
                    debug: false,
                    verbose: false,
                    idleTimeOut: 20000000,
                    commands: commands,
                    msg: {
                      send: (message) => {
                        debug(message);
                      }
                    },
                    onError: (err) => {
                      callback(err);
                    },
                    onEnd: () => {
                      //debug("callback ");
                      callback();
                    },
                    onCommandComplete: (command, response, sshObj) => {
                      //debug("--------"+command);
                      //debug(response);
                      telnetResultBuilder.addStdOut(response.replace(command + "\r\n", ""));
                      if (sshObj.commands.length > 0) {
                        //debug(sshObj.commands[0]);
                        telnetResultBuilder.addStdIn(sshObj.commands[0] + '\r\n');
                      }
                      userChoice.userChoiceReturn = telnetResultBuilder.getResult();
                      JobService.updateJob(job.id, JobStatus.Continue, userChoice)

                    }
                  };

                  //debug(host.commands);

                  const sshSystem = new SSH2Shell(host);
                  sshSystem.connect();

                }


              ],
              (err) => {
                if (err) {
                  debug('=====');
                  error(err);
                  telnetResultBuilder.addStdErr("" + err, true);
                }
                userChoice.userChoiceReturn = telnetResultBuilder.getResult(true);
                JobService.updateJob(job.id, JobStatus.Done, userChoice)

              });
          })
          .catch(err => {
            error(err);
            debug('------');
            userChoice.userChoiceReturn = "System error " + err;
            JobService.updateJob(job.id, JobStatus.Done, userChoice);
            reject(err);
          });
    });

  }
}

/**
 * Class to manage ssh results
 */
export class TelnetResultBuilder {


  constructor () {
    // Separator is used to know what should be display to the user (between IN<separator> and OUT<separator>)
    this._separator = "-------------------------------" + (new Date()).getTime();

    this._separatorInRe = new RegExp(`^[\\s\\S]*IN${this._separator}.*[\r\n]*`, "m");
    this._separatorOutRe = new RegExp(`.*OUT${this._separator}[\\s\\S]*$`, "m");

    this._shellSeparatorIn = [`stty cols 800`, `echo 'IN${this._separator}'`];
    this._shellSeparatorOut = [`echo 'OUT${this._separator}'`];

  }

  // the separator
  private _separator: string;

  // the bash command to receive the IN and OUT separators from the ssh
  private _shellSeparatorIn: string[];
  private _shellSeparatorOut: string[];

  // the regexp to catch IN and OUT separators
  private _separatorInRe: RegExp;
  private _separatorOutRe: RegExp;

  // The out from the ssh (containing span for a nice display)
  private _result: string = "";

  /**
   * Add a stdout result to the global result
   * @param data
   */
  addStdOut (data: string) {
    // due to no stderr from ssh2 in shell mode, add some hardcoded rule to stderr
    if (data.match(/^Error:/)) {
      return this.addStdErr(data);
    }
    if (data.match(/^[^.]*.java:[^:]*: error/)) {
      return this.addStdErr(data);
    }


    this._addResult(data, "out")
  }

  /**
   * Add a stdin result to the global result
   * @param data
   */
  addStdIn (data: string) {
    this._addResult(data, 'in')
  }

  /**
   * Add a stderr result to the global result
   * @param data
   * @param addSeparator (in case of real error, if no separator already, add one)
   */
  addStdErr (data: string, addSeparator = false) {
    if (addSeparator && !this._result.match(this._separatorInRe)) {
      this._addResult(`IN${this._separator}\r\n`, "err")
    }


    this._addResult(data, "err")
  }

  /**
   * Get the result that should be displayed to user
   * @param ended (is the job ended)
   * @returns {string}
   */
  getResult (ended?: boolean): string {

    let result = "";

    if (this._result.match(this._separatorInRe)) {
      result = this._result.replace(this._separatorInRe, "");
      if (this._result.toString().match(this._separatorOutRe)) {
        result = result.replace(this._separatorOutRe, "");
      }
    }

    if (!ended) {
      return '<span class="running"></span>' + result;
    } else {
      return '<span></span>' + result;
    }
  }

  /**
   * get the IN separator command
   * @returns {string[]}
   */
  get shellSeparatorIn (): string[] {
    return this._shellSeparatorIn;
  }

  /**
   * get the OUT separator command
   * @returns {string[]}
   */
  get shellSeparatorOut (): string[] {
    return this._shellSeparatorOut;
  }

  /**
   * Add a result to the global one
   * @param data the result
   * @param type 'out', 'in' and 'err'
   * @param noSplit (do we need to split)
   * @private
   */
  private _addResult (data: string, type: string, noSplit = false): void {
    if (this._result.length > 1024 * 1024) {
      return;
    }

    // split with \r\n to have nicer result
    if (!noSplit && (data.indexOf('\r\n') != -1)) {
      const datas = data.split('\r\n');
      for (let i = 0; i < datas.length; i++) {
        //console.log("---" + datas[i] + "---");
        if (i != datas.length - 1) {
          datas[i] += '\r\n';
        }
        this._addResult(datas[i], type, true);
      }
      return;
    }

    if (data != '') {
      this._result += `<span class='${type}'>${data}</span>`;
    }
    return;
  }


}
