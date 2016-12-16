import { Component, OnInit, Input, NgModule, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MdButtonModule, MdInputModule, MdIconModule, MdSlideToggleModule } from "@angular/material";
import { User } from "../user";
import { Subject } from "rxjs";
import { UserService } from "../user.service";
import { NotificationService } from "../../widget/notification/notification.service";
import { Logger } from "angular2-logger/core";

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input()
  private user: User;

  @Input()
  edited: boolean = false;

  @Input()
  index: number = 0;

  @Output()
  notifyUsersChange: EventEmitter<User[]> = new EventEmitter<User[]>();

  private deleteUserClicked = false;

  private userClosed = true;

  // to check changes
  private previousUsername = "";
  private previousUserJson = "";

  // The queue to manage user choices
  private subjectUser: Subject<User>;


  constructor (private _userService: UserService,
               private _notificationService: NotificationService,
               private _logger: Logger) { }

  ngOnInit () {
    //this.userClosed=(this.index != 0);

    this.user['courseIds'] = Object.keys(this.user['courses']);
    this.user['statIds'] = Object.keys(this.user['stats']);
    this.previousUserJson = JSON.stringify(this.user);

    // ----------
    // Save user choice changes to Db
    // ----------
    if (!this.subjectUser) {
      this.subjectUser = new Subject<User>();
      this.subjectUser
          .debounceTime(500)
          .subscribe(
            user => {
              //console.log(user);
              return this._userService.save(user)
                         .then(() => {
                           this._notificationService.message("All your modifications have been saved...");
                         })
                         .catch(error => {
                           this._logger.error(error);
                           this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error));
                         });
            },
            error => {
              this._logger.error(error)
            }
          );
    }

  }

  /**
   * Validate the username rules
   */
  userNameChanged () {
    // username should be lowercase and replace space with underscore
    if (this.user.username) {
      this.user.username = this.user.username
                               .toLowerCase()
                               .replace(" ", "_");
    }

    // Should match the pattern
    if (!this.user.username.match("^[a-z][a-z0-9_-]*$")) {
      this.user.username = this.previousUsername;
    } else if (this.previousUsername != this.user.username) {
      this.previousUsername = this.user.username;
      this.userChange();
    }
  }

  /**
   * User has potentialy be changed (add it to the queue)
   */
  userChange () {
    const userJson = JSON.stringify(this.user);
    if (this.previousUserJson === userJson) {
      return;
    }

    this.previousUserJson = userJson;

    this.subjectUser.next(this.user);
  }

  /**
   * Open/close the user card
   */
  toggleUserClosed () {
    this.userClosed = !this.userClosed;
  }

  /**
   * remove this user
   */
  deleteUser() {
    if (!this.deleteUserClicked) {
      this.deleteUserClicked = true;
      setTimeout(() => {
          this.deleteUserClicked = false;
        },
        3000);
    } else {
      this.deleteUserClicked = false;
      this._userService.remove(this.user)
          .then(users => {
            this._notificationService.message("All your modifications have been saved...");

            this.notifyUsersChange.emit(users)
          })
          .catch(error => {
            this._logger.error(error);
            this._notificationService.error("Error saving you changes !!", (error.statusText || error.message || error.error || error));
          });
    }
  }



}

@NgModule({
  imports: [
    CommonModule,
    MdButtonModule,
    MdInputModule,
    MdSlideToggleModule,
    MdIconModule.forRoot(),
    FormsModule
  ],
  declarations: [UserCardComponent],
  exports: [UserCardComponent],
})
export class UserCardModule {
}
