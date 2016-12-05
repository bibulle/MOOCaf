import { Injectable } from "@angular/core";
import { Logger } from "angular2-logger/app/core/logger";
import { environment } from "../../environments/environment";
import { AuthHttp } from "angular2-jwt";
import { UserService } from "../user/user.service";
import { Job } from "../paragraph/job";

@Injectable()
export class JobService {

  private jobsUrl = environment.serverUrl + 'api/job';

  constructor(private _logger: Logger,
              private authHttp: AuthHttp,
              private _userService: UserService) {
  }

  /**
   * get A job
   *
   * @returns {Promise<Course>}
   */
  getJob(jobId: string): Promise < Job > {
    return this.authHttp.get(`${this.jobsUrl}/${jobId}`)
               .toPromise()
               .then(response => {

                 var job = response.json().data as Job;
                 JobService.retrieveDates(job);
                 return job;
               })
               .catch(error => this.handleError(error, this._logger));
  }

  private handleError(error: any, logger) {

    //console.log('======');
    //console.log(error);
    //logger.error(error);
    //console.log('======');

    this._userService.checkAuthent();

    if (typeof error.json === "function") {
      error = error.json()
    }

    var msg = error.message || error;

    logger.error('An error occurred : ' + msg);

    return Promise.reject(error);
  }

  /**
   * get dates fom json to date
   */
  static retrieveDates(job: Job) {
    ['lastStatus']
      .map(s => {
        if (job[s]) {
          job[s] = new Date("" + job[s]);
        }
      });
  }

}
