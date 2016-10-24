import {Component, OnInit} from "@angular/core";
import {Logger} from "angular2-logger/core";
import {Router, __router_private__} from "@angular/router";
import {UserService} from "../user.service";

@Component({
  selector: 'profile-button',
  templateUrl: 'profile-button.component.html',
  styleUrls: ['profile-button.component.css']
})
export class ProfileButtonComponent {

  user: {};

  router: Router;


  constructor(private _userService: UserService,
              private _logger: Logger,
              private _router: Router) {
    this.router = _router;

  }

  ngOnInit() {
    this._userService.checkAuthent();
    this._userService.userObservable().subscribe(
      user => {
        this.user = user;
      });
  }

  // login() {
  //   this._router.navigate(['/login'])
  // }

  logout() {
    this._userService.logout();
    this._router.navigate(['/home'])
  }

  openProfile() {
    alert('Not yet implemented');
  }

}
