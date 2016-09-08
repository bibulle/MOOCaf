import {Component} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Router} from "@angular/router";
import {AuthHttp, JwtHelper} from "angular2-jwt";
import {UserService} from "../../services/user.service";

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

  constructor(private _router: Router,
              private _http: Http,
              private _authHttp: AuthHttp,
              private _userService: UserService) {
    this.jwt = localStorage.getItem('id_token');
    this.decodedJwt = this.jwt && this.jwtHelper.decodeToken(this.jwt);
  }

  logout() {
    this._userService.logout();
    this._router.navigate(['/login']);
  }

  page() {
    this._router.navigate(['/page']);
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
      this._http.get(url)
        .subscribe(
          response => this.response = response.text(),
          error => this.response = error
        );
    }
    if (type === 'Secured') {
      // For protected routes, use AuthHttp
      this._authHttp.get(url)
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
