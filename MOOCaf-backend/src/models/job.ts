import * as _ from "lodash";

export class Job {
  id: string;

  status: JobStatus;

  result: any;

  lastStatus: Date;

  constructor(document: {}) {
    _.merge(this, document);


    this.id = this.id || this._createUId();

  }


  private _createUId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
}

export enum JobStatus {
  Done, Continue
}


