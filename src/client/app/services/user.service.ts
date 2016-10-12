// user.service.ts
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {contentHeaders} from "../common/headers";
import {JwtHelper, tokenNotExpired, AuthHttp} from "angular2-jwt";
import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {Logger} from "angular2-logger/app/core/logger";
import {User} from "../models/user";
import {environment} from "../environment";
import {NotificationService} from "./notification.service";
import {Award} from "../models/award";

@Injectable()
export class UserService {
  private loggedIn = false;


  private user = new User({});

  private jwtHelper: JwtHelper = new JwtHelper();

  private userSubject: BehaviorSubject<User>;

  private keyTokenId = 'id_token';

  constructor(private http: Http,
              private authHttp: AuthHttp,
              private _logger: Logger,
              private _notifService: NotificationService) {


    this.loggedIn = !!localStorage.getItem(this.keyTokenId);

    this.userSubject = new BehaviorSubject<User>(this.user);

    let timer = Observable.timer(3 * 1000, 3 * 1000);
    timer.subscribe(t => {
      this.checkAuthent();
    });
  }

  /**
   * Get the observable on user changes
   * @returns {Observable<User>}
   */
  userObservable(): Observable<User> {
    return this.userSubject.distinctUntilKeyChanged('username');
  }

  /**
   * Check authentication locally (is the jwt not expired)
   */
  checkAuthent() {
    //console.log("checkAuthent");
    var jwt = localStorage.getItem(this.keyTokenId);

    if (!jwt || !tokenNotExpired()) {
      this.user = new User({});
    } else {
      this.user = new User(this.jwtHelper.decodeToken(jwt));
    }

    //this._logger.info(this.user);

    // if only username add to lastname
    if (!this.user.lastname && !this.user.firstname) {
      this.user.lastname = this.user.username;
    }

    this.userSubject.next(this.user);

  }

  /**
   * Login (and get a JWT token)
   * @param username
   * @param password
   * @returns {Promise<void>}
   */
  login(username, password): Promise<void> {
    let body = JSON.stringify({username, password});

    return new Promise<void>((resolve, reject) => {
      this.http
        .post(
          environment.serverUrl + 'users/login',
          body,
          {headers: contentHeaders}
        )
        .timeout(3000, new Error('Connection timeout exceeded'))
        .toPromise()
        .then(res => {
          var data = res.json();
          if (data['id_token']) {
            localStorage.setItem(this.keyTokenId, data['id_token']);
            this.loggedIn = true;
            this.checkAuthent();
            resolve();
          }
          reject();
        })
        .catch(error => {
          var msg = error.statusText || error.message || 'Connection error';
          this._logger.error('Login', msg);
          this._notifService.error('Login', msg);
          this.checkAuthent();
          reject();
        })
    });
  }

  /**
   * Logout (just remove the JWT token)
   */
  logout() {
    localStorage.removeItem(this.keyTokenId);
    this.loggedIn = false;
    this.checkAuthent();
  }


  /**
   * Signup (create a new account)
   * @param username
   * @param password
   * @param firstname
   * @param lastname
   * @param email
   * @returns {Promise<void>}
   */
  signup(username, password, firstname, lastname, email): Promise<void> {
    let body = JSON.stringify({username, password, firstname, lastname, email});

    return new Promise<void>((resolve, reject) => {
      this.http
        .post(
          environment.serverUrl + 'users',
          body,
          {headers: contentHeaders}
        )
        .timeout(3000, new Error('Connection timeout exceeded'))
        .toPromise()
        .then(res => {
          this._notifService.success("User created", "the user " + firstname + " " + lastname + ' has been created');
          resolve();
        })
        .catch(error => {
          var msg = error._body || error.statusText || error.message || 'Connection error';
          this._logger.error('Signup', msg);
          this._notifService.error('Signup', msg);
          reject();
        })
    });
  }

  getAwards() {
    return new Promise<Award[]>((resolve, reject) => {
        this.authHttp.get(environment.serverUrl + 'api/awards', {headers: contentHeaders})
          .map((res: Response) => res.json().data as Award[])
          .subscribe(
            data => {
              //console.log(data);
              resolve(data);
            },
            err => {
              if (err._body && (err._body == "WRONG_USER")) {
                this.logout();
                reject("You have been disconnected");
              } else {
                reject(err);
              }
            },
          );
      }
    )
  }
}
