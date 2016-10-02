// user.service.ts
import {Injectable} from '@angular/core';

import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

import {Logger} from "angular2-logger/app/core/logger";

@Injectable()
export class ScrollService {

  private observables: { [id: string]: Observable<any> } = {};

  constructor(private _logger: Logger) {
  }


  setObservable(scrollDetectorId: string, subjectScroll: Subject<any>) {
    this.observables[scrollDetectorId] = subjectScroll.debounceTime(500);
  }

  getObservable(scrollDetectorId: string): Observable<any> {
    return this.observables[scrollDetectorId];
  }

  deleteObservable(scrollDetectorId: string) {
    this.observables[scrollDetectorId] = null;
  }
}
