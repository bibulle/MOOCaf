import { Component, OnInit } from '@angular/core';
import { UserService } from "../user/user.service";
import { Logger } from "angular2-logger/core";
import { Router } from "@angular/router";

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(public router: Router,
              private _logger: Logger,
              private _userService: UserService) {
  }

  ngOnInit() {
  }

  /**
   * form submit
   * @param event
   * @param username
   * @param password
   * @param firstname
   * @param lastname
   * @param email
   */
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

}
