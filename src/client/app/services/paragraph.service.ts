import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {Paragraph} from "../model/paragraph";
import {Logger} from "angular2-logger/app/core/logger";
import {AuthHttp} from 'angular2-jwt';
import {contentHeaders} from "../common/headers";

@Injectable()
export class ParagraphService {

  private paragraphsUrl = 'http://localhost:3000/api/paragraph';

  constructor(private http: Http,
              private _logger: Logger,
              public authHttp: AuthHttp) {
  }



  /**
   * get the paragraphs for the connected user
   *      The Paragraph, the previous answer of the user and the number of check done by the user
   * @returns {Promise<Paragraph[]>}
   */
  getParagraphs(): Promise<Paragraph[]> {
    return this.authHttp.get(this.paragraphsUrl)
      .toPromise()
      .then(response => {
        return response.json().data as Paragraph[]
      })
      .catch(error => this.handleError(error, this._logger));
  }

  /**
   * get A paragraphs for the connected user
   *      The Paragraph, the previous answer of the user and the number of check done by the user
   * @returns {Promise<Paragraph>}
   */
  getParagraph(uid: string): Promise<Paragraph> {
    return this.authHttp.get(`${this.paragraphsUrl}/${uid}`)
      .toPromise()
      .then(response => {
        return response.json().data as Paragraph
      })
      .catch(error => this.handleError(error, this._logger));
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

  /**
   * Save a userchoice
   * @param userChoice
   * @returns Promise<Paragraph>
   */
  _saveUserChoice(userChoice): Promise<Paragraph> {
    let url = `${this.paragraphsUrl}/${userChoice.paragraphId}/userchoice`;
    return this.authHttp
      .put(url, userChoice, contentHeaders)
      .toPromise()
      .then(res => {
        //console.log(res.json().data);
        //this._service.success("Saved", "your change have been saved");
        return res.json().data;
      })
      .catch(error => this.handleError(error, this._logger));
  }

  /**
   * Check a userchoice
   * @param userChoice
   * @returns Promise<Paragraph>
   */
  _checkUserChoice(userChoice): Promise<Paragraph> {
    let url = `${this.paragraphsUrl}/${userChoice.paragraphId}/userchoice/check`;
    return this.authHttp
      .put(url, userChoice, contentHeaders)
      .toPromise()
      .then(res => {
        //console.log(res.json().data);
        //this._service.success("Saved", "your change have been saved");
        return res.json().data;
      })
      .catch(error => this.handleError(error, this._logger));
  }

  /**
   * Save a paragraph
   * @param paragraph
   * @returns {any}
   */
  // Add new Paragraph
  private post(paragraph: Paragraph): Promise<Paragraph> {
    return this.authHttp
      .post(this.paragraphsUrl, JSON.stringify(paragraph), contentHeaders)
      .toPromise()
      .then(res => {
        //this._service.success("Saved", "your change have been saved");
        return res.json().data;
      })
      .catch(error => this.handleError(error, this._logger));
  }

  // Update existing Paragraph
  private put(paragraph: Paragraph): Promise<Paragraph> {
    let url = `${this.paragraphsUrl}/${paragraph.id}`;
    return this.authHttp
      .put(url, JSON.stringify(paragraph), contentHeaders)
      .toPromise()
      .then(() => {
        //this._service.success("Saved", "your change have been saved");
        return paragraph
      })
      //.catch(error => this.handleError(error, this._logger));
  }

  /**
   * save paragraphs (user choice)
   * @param fullUserChoice (UID and userchoice)
   * @returns {Promise<void>|Promise<T>}
   */
  saveUserChoice(paragraph: Paragraph): Promise<Paragraph> {

    var userChoice = {
      paragraphId: paragraph.id,
      userChoice: paragraph.userChoice
    }

    this._logger.debug("saveUserChoice : " + JSON.stringify(userChoice));

    return this._saveUserChoice(userChoice);
  }

  checkUserChoice(paragraph: Paragraph): Promise<Paragraph> {

    var userChoice = {
      paragraphId: paragraph.id,
      userChoice: paragraph.userChoice
    }

    this._logger.debug("checkUserChoice : " + JSON.stringify(userChoice));

    return this._checkUserChoice(userChoice)
      .then(paragraph => {
        //this._logger.debug(paragraph);
        if (paragraph.userCheckOK === true) {
          //this._service.success("Correct !!", "Your answer is correct");
        } else {
          if (paragraph.userCheckCount >= paragraph.maxCheckCount) {
            //this._service.error("Wrong answer !!", "Your answer is not correct (no more try)");
          } else {
            //this._service.alert("Wrong answer !!", "Your answer is not correct (" + (paragraph.maxCheckCount - paragraph.userCheckCount) + " try remaining)");
          }
        }
        return paragraph;
      })
      .catch(error => this.handleError(error, this._logger));

  }

  private handleError(error: any, logger) {

    if (typeof error.json === "function") {
      error = error.json()
    }

    var msg = error.message  || error;

    //logger.error('An error occurred : '+msg);

    return Promise.reject(error);
  }






}
