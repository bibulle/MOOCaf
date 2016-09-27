import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Logger} from "angular2-logger/app/core/logger";
import {AuthHttp} from "angular2-jwt";
import {contentHeaders} from "../common/headers";
import {UserService} from "./user.service";
import {Formation} from "../models/formation";
import {environment} from "../environment";
import {Observable, BehaviorSubject} from 'rxjs/Rx';

@Injectable()
export class FormationService {

  private formationsUrl = environment.serverUrl+'api/formation';

  private currentFormationCountSubject: BehaviorSubject<number>;

  constructor(private _logger: Logger,
              private authHttp: AuthHttp,
              private userService: UserService) {

    this.currentFormationCountSubject = new BehaviorSubject<number>(0);

    // Subscribe to user changes to know if there is a current class
    this.userService.userObservable().subscribe(
      user => {
        this.checkCurrentFormation();
      });


  }

  /**
   * Subscribe to know if current formation changes
   */
  currentFormationObservable(): Observable<number> {
    return this.currentFormationCountSubject;
  }

  /**
   * local method to check if the user have some current formations
   */
  private checkCurrentFormation() {
    this.getFormations(true)
      .then(lst => {
        this.currentFormationCountSubject.next(lst.length);
      })
      .catch(err => {
          this.currentFormationCountSubject.next(0);
        }
      )
  }

  /**
   * get the formations for the connected user
   *      The Formations, the progression, favorite and interest of the user
   * @param currentOnly (should only return the "current" formation ... thestarted and not yet finished)
   * @returns {Promise<Formation[]>}
   */
  getFormations(currentOnly = false): Promise<Formation[]> {
    return new Promise<Formation[]>((resolve, reject) => {
        this.authHttp.get(this.formationsUrl+"?currentOnly="+currentOnly)
          .map((res: Response) => res.json().data as Formation[])
          .subscribe(
            data => {
              //console.log(data);
              data = data.map(f => {
                [ 'created', 'updated', 'dateFollowed', 'dateFollowedEnd']
                  .map(s => {
                    if (f[s]) {
                      f[s] = new Date(""+f[s]);
                    }
                  });
                return f
              });
              //console.log(data);
              resolve(data);
            },
            err => {
              reject(err);
            },
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
        var formation = response.json().data as Formation;
        return formation;
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
  _saveUserValues(userChoice): Promise < Formation > {
    let url = `${this.formationsUrl}/${userChoice.formationId}/userValues`;
    return this.authHttp
      .put(url, userChoice, { headers: contentHeaders})
      .toPromise()
      .then(res => {
        //console.log('======');
        //console.log(res);
        //console.log('======');
        //this._service.success("Saved", "your change have been saved");
        this.checkCurrentFormation();

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
      .post(this.formationsUrl, JSON.stringify(formation), { headers: contentHeaders})
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
      .put(url, JSON.stringify(formation), { headers: contentHeaders})
      .toPromise()
      .then(() => {
        //this._service.success("Saved", "your change have been saved");
        return formation
      });
//.catch(error => this.handleError(error, this._logger));
  }

  /**
   * save paragraphs (user choice)
   * @returns {Promise<void>|Promise<Formation>}
   * @param formation Formation
   */
  saveUserValues(formation: Formation): Promise < Formation > {

    var userChoice = {
      formationId: formation.id,
      isFavorite: formation.isFavorite
    };

    //this._logger.debug("saveUserChoice : " + JSON.stringify(userChoice));

    return this._saveUserValues(userChoice);
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
