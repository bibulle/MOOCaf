// user.service.ts
import {Injectable} from '@angular/core';

import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

//import {Logger} from "angular2-logger/app/core/logger";
import {ScrollDirective} from "../directives/scroll-directive";

@Injectable()
export class ScrollService {

  private observables: { [id: string]: Observable<any> } = {};
  private directives: { [id: string]: ScrollDirective } = {};

  constructor(
    //private _logger: Logger
  ) {
  }


  setObservable(scrollDetectorId: string, subjectScroll: Subject<any>, directive: ScrollDirective) {
    this.observables[scrollDetectorId] = subjectScroll.debounceTime(500);
    this.directives[scrollDetectorId] = directive;
  }

  getObservable(scrollDetectorId: string): Observable<any> {
    return this.observables[scrollDetectorId];
  }

  deleteObservable(scrollDetectorId: string) {
    this.observables[scrollDetectorId] = null;
    this.directives[scrollDetectorId] = null;
  }

  launchFakeEvent(scrollDetectorId: string) {
    //this._logger.debug("launchFakeEvent "+this.directives[scrollDetectorId]);
    // On new client, launch a scroll event
    if (this.directives[scrollDetectorId]) {
      this.directives[scrollDetectorId].onScroll();
    }
  }
}
