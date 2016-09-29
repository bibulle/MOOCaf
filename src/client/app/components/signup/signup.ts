import {Component} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Router} from "@angular/router";
import {contentHeaders} from "../../common/headers";
import {Logger} from "angular2-logger/core";
import {UserService} from "../../services/user.service";

@Component({
  moduleId: module.id,
  selector: 'signup',
  templateUrl: 'signup.html',
  styleUrls: [ 'signup.css' ]
})
export class SignupComponent {

  constructor(public router: Router,
              private _logger: Logger,
              private _userService: UserService) {
  }

  signup(event, username, password, firstname, lastname, email) {
    //this._logger.debug("signup("+username+", "+password+", "+firstname+", "+lastname+", "+email+")");
    event.preventDefault();

    this._userService.signup(username, password, firstname, lastname, email)
      .then(() => {
        this.router.navigate(['home']);
      })
      .catch( () => {
        this._logger.warn("Error during login process");
      });
  }

  login(event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }

}
