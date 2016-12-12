import { Component, OnInit } from '@angular/core';
import { User } from "./user";
import { UserService } from "./user.service";
import { NotificationService } from "../widget/notification/notification.service";

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  private users: User[];
  private userIsAdmin: boolean = false;

  private edited = false;

  constructor(private _notificationService: NotificationService,
              private _userService: UserService) {

  }

  ngOnInit() {
    // check user right
    this._userService.userObservable().subscribe(
      () => {
        this.userIsAdmin = this._userService.isAdmin();
      });

    this._userService.getUsers()
        .then(users => {
          this.users = users;

        })
        .catch(err => {
          this._notificationService.error("Error", err)
        });
  }

  toggleEditMode() {
    this.edited = !this.edited;
  }

}
