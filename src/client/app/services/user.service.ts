// user.service.ts
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {contentHeaders} from "../common/headers";
import {JwtHelper, tokenNotExpired} from "angular2-jwt";
import {Observable} from 'rxjs/Rx';
import {Logger} from "angular2-logger/app/core/logger";
import {User} from "../model/user";

@Injectable()
export class UserService {
  private loggedIn = false;


  private user = new User({});

  private jwtHelper: JwtHelper = new JwtHelper();


  constructor(private http: Http,
              private _logger: Logger) {
    this.loggedIn = !!localStorage.getItem('auth_token');

    let timer = Observable.timer(60*1000, 60*1000);
    timer.subscribe(this.checkAuthent);
    // setTimeout(() => {
    //   this.checkAuthent();
    // },
    // 60*1000);
  }

  checkAuthent() {
    var jwt = localStorage.getItem('id_token');

    if (!jwt || !tokenNotExpired()) {
      this.user = new User({});
    } else {
      this.user = new User(this.jwtHelper.decodeToken(jwt));
    }

    // if only username add to lastname
    if (!this.user.lastname && !this.user.firstname) {
      this.user.lastname = this.user.username;
    }

  }

  login(email, password) {
    return this.http
      .post(
        '/login',
        JSON.stringify({ email, password }),
        contentHeaders
      )
      .map(res => res.json())
      .map((res) => {
        if (res.success) {
          localStorage.setItem('auth_token', res['auth_token']);
          this.loggedIn = true;
          this.checkAuthent();
        }

        return res.success;
      });
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn = false;
    this.checkAuthent();
  }

  isLoggedIn() {
    this.checkAuthent();
    return this.loggedIn;
  }

  getUser() {
    return this.user;
  }
}
