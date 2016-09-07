import {Component} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Logger} from "angular2-logger/core";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'profile-button',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css']
})
export class ProfileComponent {

  user: {};


  constructor(private userService: UserService,
              private _logger: Logger,
              private router: Router) {
  }

  ngOnInit() {
    this.userService.checkAuthent();
    this.user = this.userService.getUser();

    //console.log(this.user);
  }

  login() {
    this._logger.debug("login()");
    this.router.navigate([ '/login' ])
  }

}
