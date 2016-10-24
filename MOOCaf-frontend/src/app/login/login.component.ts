import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Http } from "@angular/http";
import { Logger } from "angular2-logger/core";
import { NotificationService } from "../widget/notification/notification.service";
import { UserService } from "../user/user.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  constructor(public router: Router,
              public http: Http,
              private _logger: Logger,
              private _notifService: NotificationService,
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
