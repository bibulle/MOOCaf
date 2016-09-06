import {Component} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Router} from "@angular/router";
import {AuthHttp, JwtHelper} from "angular2-jwt";

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.html',
  styleUrls: [ 'home.css' ]
})
export class HomeComponent {
  jwt: string;
  decodedJwt: string;
  response: string;
  api: string;

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(public router: Router, public http: Http, public authHttp: AuthHttp) {
    this.jwt = localStorage.getItem('id_token');
    this.decodedJwt = this.jwt && this.jwtHelper.decodeToken(this.jwt);
  }

  logout() {
    localStorage.removeItem('id_token');
    this.router.navigate(['/login']);
  }

  page() {
    this.router.navigate(['/page']);
  }

  callAnonymousApi() {
    this._callApi('Anonymous', 'http://localhost:3000/api/random-quote');
  }

  callSecuredApi() {
    this._callApi('Secured', 'http://localhost:3000/api/protected/random-quote');
  }

  _callApi(type, url) {
    this.response = null;
    if (type === 'Anonymous') {
      // For non-protected routes, just use Http
      this.http.get(url)
        .subscribe(
          response => this.response = response.text(),
          error => this.response = error
        );
    }
    if (type === 'Secured') {
      // For protected routes, use AuthHttp
      this.authHttp.get(url)
        .subscribe(
          response => this.response = response.text(),
          error => {
            console.log(error);
            this.response = error
          }
        );
    }
  }
}
