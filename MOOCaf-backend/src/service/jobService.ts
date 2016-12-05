var debug = require('debug')('server:service:jobRouter');

import { Job, JobStatus } from "../models/job";

export default class JobService {


  static jobs: Job[] = [];
  static subscribers: { [id: string] : Function} = {};


  /**
   * Create a jobRouter
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

    if (this.subscribers[job.id]) {
      this.subscribers[job.id](job);
      if (job.status == JobStatus.Done) {
        this.unSubscribeJob(job.id);
      }
    }

    // clean old jobs
    this._cleanOldJobs();

    return job;
  }

  /**
   * Get an existing jobRouter
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
   * Update a jobRouter with new status and/or result
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

    if (this.subscribers[job.id]) {
      this.subscribers[job.id](job);
      if (job.status == JobStatus.Done) {
        this.unSubscribeJob(job.id);
      }
    }

    // clean old jobs
    this._cleanOldJobs();

    return job;
  }

  /**
   * Subscribe to a jobRouter
   */
  static subscribeJob(id: string, callback: Function) {
    this.subscribers[id] = callback;
  }

  /**
   * Unsubscribe to a jobRouter
   */
  static unSubscribeJob(id: string) {
    delete this.subscribers[id];
  }

  /**
   * Clean old jobRouter...( nothing apppend for 10 hours)
   * @returns {Promise<void>}
   * @private
   */
  static _cleanOldJobs(): Promise<void> {
    return new Promise<void>((resolve) => {
      var limitTime = Date.now() - 10 * 60 * 60 * 1000;
      this.jobs = this.jobs.filter(j => {
        var ret = (j.lastStatus.getTime() > limitTime);
        if (!ret) {
          this.unSubscribeJob(j.id);
        }
        return ret;
      });
      resolve();
    })

  }

}
