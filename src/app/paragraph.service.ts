import { Injectable } from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {Paragraph} from "./paragraph";

@Injectable()
export class ParagraphService {

  private paragraphsUrl = 'app/paragraphs';

  constructor(private http: Http) { }

  getParagraphs() {

    return this.http.get(this.paragraphsUrl)
      .toPromise()
      .then(response => response.json().data as Paragraph[])
      .catch(this.handleError);

    //return Promise.resolve(PARAGRAPHS);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
