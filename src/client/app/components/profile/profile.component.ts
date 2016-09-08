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


  constructor(private _userService: UserService,
              private _logger: Logger,
              private _router: Router) {
  }

  ngOnInit() {
    this._userService.checkAuthent();
    this._userService.userObservable().subscribe(
      user => {
        //console.log(user);
        this.user = user;
      });
  }

  login() {
    this._router.navigate(['/login'])
  }

  logout() {
    this._userService.logout();
    this._router.navigate(['/home'])
  }

  openProfile() {
    alert('Not yet implemented');
  }

}
