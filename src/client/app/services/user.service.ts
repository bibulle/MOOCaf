// user.service.ts
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {contentHeaders} from "../common/headers";
import {JwtHelper, tokenNotExpired} from "angular2-jwt";
//import localStorage from 'localStorage';

@Injectable()
export class UserService {
  private loggedIn = false;

  private jwtHelper: JwtHelper = new JwtHelper();


  constructor(private http: Http) {
    this.loggedIn = !!localStorage.getItem('auth_token');
  }

  checkAuthent() {
    console.log(tokenNotExpired);
    var jwt = localStorage.getItem('id_token');
    console.log(jwt);
    console.log(jwt && this.jwtHelper.decodeToken(jwt));
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
        }

        return res.success;
      });
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
