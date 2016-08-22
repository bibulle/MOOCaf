import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {Paragraph} from "../model/paragraph";
import {Logger} from "angular2-logger/app/core/logger";

@Injectable()
export class ParagraphService {

  private paragraphsUrl = 'app/paragraphs';

  constructor(private http: Http,
              private _logger: Logger) {
  }

  /**
   * get the paragraphs for the connected user
   *      The Paragraph, the previous answer of the user and the number of check done by the user
   * @returns {Promise<Paragraph[]>}
   */
  getParagraphs(): Promise<Paragraph[]> {
    return this.http.get(this.paragraphsUrl)
      .toPromise()
      .then(response => response.json().data as Paragraph[])
      .catch(this.handleError);
  }

  /**
   * get A paragraphs for the connected user
   *      The Paragraph, the previous answer of the user and the number of check done by the user
   * @returns {Promise<Paragraph>}
   */
  getParagraph(uid: string): Promise<Paragraph> {
    //console.log("getParagraph "+uid)
    return this.getParagraphs()
      .then(paragraphs => paragraphs.find(p => p.id === uid))
      .catch(this.handleError);
  }

  /**
   * Save a paragraph
   * @param paragraph
   * @returns {any}
   */
  save(paragraph: Paragraph): Promise<Paragraph> {
    if (paragraph.id) {
      return this.put(paragraph);
    }
    return this.post(paragraph);
  }

// Add new Paragraph
  private post(paragraph: Paragraph): Promise<Paragraph> {
    //console.log("post");
    //console.log(paragraph);
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http
      .post(this.paragraphsUrl, JSON.stringify(paragraph), {headers: headers})
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }

  // Update existing Paragraph
  private put(paragraph: Paragraph): Promise<Paragraph> {
    //console.log("put");
    //console.log(paragraph);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = `${this.paragraphsUrl}/${paragraph.id}`;
    return this.http
      .put(url, JSON.stringify(paragraph), {headers: headers})
      .toPromise()
      .then(() => paragraph)
      .catch(this.handleError);
  }

  /**
   * save paragraphs (user choice)
   * @param fullUserChoice (UID and userchoice)
   * @returns {Promise<void>|Promise<T>}
   */
  saveUserChoice(fullUserChoice: {UID; userChoice}) {
    this._logger.debug("saveUserChoice : "+JSON.stringify(fullUserChoice));
    let paragraph = this.getParagraph(fullUserChoice.UID)
      .then(paragraph => {
        if (!paragraph.userCheckOK && (paragraph.userCheckCount < paragraph.maxCheckCount)) {
          paragraph.userChoice = fullUserChoice.userChoice
        }
        return paragraph;
      })
      .then(paragraph => this.save(paragraph))
      .catch(this.handleError);

    return paragraph;
  }

  checkUserChoice(fullUserChoice: {UID; userChoice}) {
    this._logger.debug("checkUserChoice : "+JSON.stringify(fullUserChoice));
    let paragraph = this.getParagraph(fullUserChoice.UID)
      .then(paragraph => {
        paragraph.userCheckCount += 1;
        paragraph.userCheckOK = !(Math.random()+.5|0);
        paragraph.userChoice = fullUserChoice.userChoice;
        return (paragraph);
      })
      .then(paragraph => this.save(paragraph))
      .catch(this.handleError);

    return paragraph;
  }

  private handleError(error: any) {
    // TODO: Just do it !!
    this._logger.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
