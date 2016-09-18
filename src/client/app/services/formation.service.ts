import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Logger} from "angular2-logger/app/core/logger";
import {AuthHttp} from "angular2-jwt";
import {contentHeaders} from "../common/headers";
import {UserService} from "./user.service";
import {Formation} from "../models/formation";
import {environment} from "../environment";

@Injectable()
export class FormationService {

  private formationsUrl = environment.serverUrl+'api/formation';

  constructor(private http: Http,
              private _logger: Logger,
              private authHttp: AuthHttp,
              private userService: UserService) {
  }


  /**
   * get the formations for the connected user
   *      The Formations, the progression, favorite and interest of the user
   * @returns {Promise<Formation[]>}
   */
  getFormations(): Promise<Formation[]> {
    return new Promise<Formation[]>((resolve, reject) => {
        this.authHttp.get(this.formationsUrl)
          .map((res: Response) => res.json().data as Formation[])
          .subscribe(
            data => {
              //console.log(data);
              data = data.map(f => {
                if (f.created) {
                  f.created = new Date(""+f.created);
                }
                if (f.update) {
                  f.update = new Date(""+f.update);
                }
                return f
              });
              //console.log(data);
              resolve(data);
            },
            err => {
              reject(err);
            },
            () => console.log('done')
          )
      }
    )
  }

  /**
   * get A formation for the connected user
   *      The Paragraph, the progression, favorite and interest of the user
   * @returns {Promise<Formation>}
   */
  getFormation(uid: string): Promise < Formation > {
    return this.authHttp.get(`${this.formationsUrl}/${uid}`)
      .toPromise()
      .then(response => {
        return response.json().data as Formation
      })
      .catch(error => this.handleError(error, this._logger));
  }

  /**
   * Save a formation
   * @param formation
   * @returns Promise<Formation>
   */
  save(formation: Formation): Promise < Formation > {
    if (formation.id
    ) {
      return this.put(formation);
    }
    return this.post(formation);
  }

  /**
   * Save a favorite or not
   * @param userChoice ({ formationId: string, isFavorite: boolean })
   * @returns Promise<Formation>
   */
  _saveUserChoice(userChoice): Promise < Formation > {
    let url = `${this.formationsUrl}/${userChoice.formationId}/userchoice`;
    return this.authHttp
      .put(url, userChoice, contentHeaders)
      .toPromise()
      .then(res => {
        //console.log('======');
        //console.log(res);
        //console.log('======');
        //this._service.success("Saved", "your change have been saved");
        return res.json().data;
      })
      .catch(error => this.handleError(error, this._logger));
  }

  /**
   * Save a formation
   * @param formation
   * @returns Promise<Formation>
   */
// Add new Paragraph
  private
  post(formation: Formation): Promise < Formation > {
    return this.authHttp
      .post(this.formationsUrl, JSON.stringify(formation), contentHeaders)
      .toPromise()
      .then(res => {
        //this._service.success("Saved", "your change have been saved");
        return res.json().data;
      })
      .catch(error => this.handleError(error, this._logger));
  }

// Update existing Formation
  private put(formation: Formation): Promise < Formation > {
    let url = `${this.formationsUrl}/${formation.id}`;
    return this.authHttp
      .put(url, JSON.stringify(formation), contentHeaders)
      .toPromise()
      .then(() => {
        //this._service.success("Saved", "your change have been saved");
        return formation
      })
//.catch(error => this.handleError(error, this._logger));
  }

  /**
   * save paragraphs (user choice)
   * @param fullUserChoice (UID and userchoice)
   * @returns {Promise<void>|Promise<T>}
   */
  saveUserChoice(formation: Formation): Promise < Formation > {

    var userChoice = {
      formationId: formation.id,
      isFavorite: formation.isFavorite
    }

    this._logger.debug("saveUserChoice : " + JSON.stringify(userChoice));

    return this._saveUserChoice(userChoice);
  }

  private handleError(error: any, logger) {

    //console.log('======');
    //console.log(error);
    //logger.error(error);
    //console.log('======');

    this.userService.checkAuthent();

    if (typeof error.json === "function") {
      error = error.json()
    }

    var msg = error.message || error;

    logger.error('An error occurred : ' + msg);

    return Promise.reject(error);
  }


}
