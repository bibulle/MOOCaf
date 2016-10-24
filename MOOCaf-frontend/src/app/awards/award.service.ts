import { Injectable } from '@angular/core';
import { Award } from "./award";
import { environment } from "../../environments/environment";
import { Response } from "@angular/http";
import { Logger } from "angular2-logger/core";
import { AuthHttp } from "angular2-jwt";
import { CommonHeaders } from "../shared/common-headers";
import { UserService } from "../user/user.service";


@Injectable()
export class AwardService {

  constructor(private authHttp: AuthHttp,
              //private _logger: Logger,
              private _userService: UserService) { }

  /**
   * Get the list a awards
   * @returns {Promise<Award[]>}
   */
  getAwards() {
    return new Promise<Award[]>((resolve, reject) => {
      this.authHttp.get(environment.serverUrl + 'api/award', {headers: CommonHeaders.contentHeaders})
          .map((res: Response) => res.json().data as Award[])
          .subscribe(
            data => {
              //console.log(data);
              resolve(data);
            },
            err => {
              if (err._body && (err._body == "WRONG_USER")) {
                this._userService.logout();
                reject("You have been disconnected");
              } else {
                reject(err);
              }
            },
          );
    })
  }

  /**
   * save award
   * @param award
   * @returns {Promise<Award>}
   */
  saveAward(award: Award): Promise<Award> {
    return new Promise<Award>((resolve, reject) => {
      this.authHttp
          .put(environment.serverUrl + 'api/award', award, {headers: CommonHeaders.contentHeaders})
          .map((res: Response) => res.json().data as Award)
          .subscribe(
            data => {
              //console.log(data);
              resolve(data);
            },
            err => {
              if (err._body && (err._body == "WRONG_USER")) {
                this._userService.logout();
                reject("You have been disconnected");
              } else {
                reject(err);
              }
            },
          );
    });
  }

  /**
   * add an award
   * @returns {Promise<Award[]>}
   */
  addAward(): Promise<Award[]> {

    return new Promise<Award[]>((resolve, reject) => {
      this.authHttp
          .put(environment.serverUrl + 'api/award/add', {}, {headers: CommonHeaders.contentHeaders})
          .map((res: Response) => res.json().data as Award[])
          .subscribe(
            data => {
              //console.log(data);
              resolve(data);
            },
            err => {
              if (err._body && (err._body == "WRONG_USER")) {
                this._userService.logout();
                reject("You have been disconnected");
              } else {
                reject(err);
              }
            });
    })
  }

  /**
   * remove an award
   * @param award
   * @returns {Promise<Award[]>}
   */
  deleteAward(award: Award): Promise<Award[]> {

    return new Promise<Award[]>((resolve, reject) => {
      this.authHttp
          .delete(`${environment.serverUrl}api/award/${award.id}`, {headers: CommonHeaders.contentHeaders})
          .map((res: Response) => res.json().data as Award[])
          .subscribe(
            data => {
              //console.log(data);
              resolve(data);
            },
            err => {
              if (err._body && (err._body == "WRONG_USER")) {
                this._userService.logout();
                reject("You have been disconnected");
              } else {
                reject(err);
              }
            });
    })
  }


}
