var debug = require('debug')('server:service:job');

import { Job, JobStatus } from "../models/job";

export default class JobService {


  static jobs: Job[] = [];


  /**
   * Create a job
   * @param id can be null
   * @param status
   * @param result
   * @returns {Job}
   */
  static createJob(id: string, status: JobStatus, result: any): Job {
    var job = new Job({
      id: id,
      status: status,
      result: result,
      lastStatus: new Date()
    });

    if (status != JobStatus.Done) {
      this.jobs.push(job);
    }

    // clean old jobs
    this._cleanOldJobs();

    return job;
  }

  /**
   * Get an existing job
   * @param id
   * @returns {Job}
   */
  static getJob(id: string): Job {
    var job = this.jobs.find( j => {
      return j.id === id;
    });

    // clean old jobs
    this._cleanOldJobs();

    return job;
  }

  /**
   * Update a job with new status and/or result
   * @param id
   * @param status
   * @param result
   * @returns {Job}
   */
  static updateJob(id: string, status: JobStatus, result: any): Job {
    var job = this.getJob(id);

    if (!job) {
      job = this.createJob(id, status, result);
    } else {
      job.status = status;
      job.result = result;
      job.lastStatus = new Date();
    }

    // clean old jobs
    this._cleanOldJobs();

    return job;
  }

  /**
   * Clean old job...
   * @returns {Promise<void>}
   * @private
   */
  static _cleanOldJobs(): Promise<void> {
    return new Promise<void>((resolve) => {
      var limitTime = Date.now() - 10 * 60 * 60 * 1000;
      this.jobs = this.jobs.filter(j => {
        return j.lastStatus.getTime() > limitTime
      });
      resolve();
    })

  }

}
