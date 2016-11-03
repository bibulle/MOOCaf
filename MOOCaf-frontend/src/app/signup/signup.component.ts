import { Component, OnInit } from '@angular/core';
import { UserService } from "../user/user.service";
import { Logger } from "angular2-logger/core";
import { Router } from "@angular/router";
import { User } from "../user/user";

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  user: User  = new User({});

  previousUsername = "";

  constructor(public router: Router,
              private _logger: Logger,
              private _userService: UserService) {
  }

  ngOnInit() {
  }

  userNameChanged() {
    // username should be lowercase and replace space with underscore
    if (this.user.username) {
      this.user.username = this.user.username
                               .toLowerCase()
                               .replace(" ","_");
    }

    // Should match the pattern
    if (!this.user.username.match("^[a-z][a-z0-9_-]*$")) {
      this.user.username = this.previousUsername;
    } else {
      this.previousUsername = this.user.username;
    }
  }
  /**
   * form submit.. do the job
   */
  signup() {
    //this._logger.debug(this.user);

     this._userService.signup(this.user.username, this.user['password'], this.user.firstname, this.user.lastname, this.user.email)
         .then(() => {
           this.router.navigate(['home']);
         })
         .catch( () => {
           this._logger.warn("Error during login process");
         });
  }

}
