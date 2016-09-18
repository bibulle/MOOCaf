import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {Http, Headers} from "@angular/http";
import {contentHeaders} from "../../common/headers";
import {Logger} from "angular2-logger/core";
import {NotificationsService} from "angular2-notifications";
import {environment} from "../../environment";
import {UserService} from "../../services/user.service";

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.html',
  styleUrls: [ 'login.css' ]
})
export class LoginComponent {
  constructor(public router: Router,
              public http: Http,
              private _logger: Logger,
              private _notifService: NotificationsService,
              private _userService: UserService) {
  }

  login(event, username, password) {
    //console.log(username+" "+password);
    event.preventDefault();

    this._userService.login(username, password)
      .then(() => {
        this.router.navigate(['home']);
      })
      .catch( () => {
        this._logger.warn("Error during login process");
      });
  }

  signup(event) {
    event.preventDefault();
    this.router.navigate(['/signup']);
  }
}
