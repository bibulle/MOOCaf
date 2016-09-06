
import {Component} from "@angular/core";
import {UserService} from "../services/user.service";

@Component({
  moduleId: module.id,
  selector: 'profile-button',
  templateUrl: 'profile.component.html',
  styleUrls: [ 'profile.component.css' ]
})
export class ProfileComponent {

  user: {};


  constructor(private userService: UserService) {
  }
  ngOnInit() {
    this.userService.checkAuthent();
    this.user = this.userService.getUser();

    console.log(this.user);
  }

}
