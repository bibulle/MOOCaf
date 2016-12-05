export class Job {

  id: string;

  status: JobStatus;

  result: any;

  lastStatus: Date;

  constructor(options) {
    this.id = options.id;
    this.status = options.status;
    this.result = options.result;
    this.lastStatus = options.lastStatus;


  }
}

export enum JobStatus {
  //noinspection JSUnusedGlobalSymbols
  Done, Continue
}
