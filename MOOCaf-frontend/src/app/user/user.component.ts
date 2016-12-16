import { Component, OnInit } from '@angular/core';
import { User } from "./user";
import { UserService } from "./user.service";
import { NotificationService } from "../widget/notification/notification.service";
import { Subject } from "rxjs";
import { Logger } from "angular2-logger/core";

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  private users: User[];
  private sortedUsers: User[];

  private userIsAdmin: boolean = false;

  private edited = false;
  // The queue to manage user choices
  private subjectFilter: Subject<string>;
  private previousSearch: string = "";
  private search = "";

  constructor(private _notificationService: NotificationService,
              private _userService: UserService,
              private _logger: Logger) {

  }

  ngOnInit() {
    // check user right
    this._userService.userObservable().subscribe(
      () => {
        this.userIsAdmin = this._userService.isAdmin();
      });

    // Apply UI changes
    if (!this.subjectFilter) {
      this.subjectFilter = new Subject<string>();
      this.subjectFilter
          .debounceTime(500)
          .subscribe(
            search => {
              this._filterList(search);
            },
            error => {
              this._logger.error(error)
            }
          );
    }

    this._userService.getUsers()
        .then(users => {
          this.users = users;
          this.filterList();
        })
        .catch(err => {
          this._notificationService.error("Error", err)
        });
  }

  toggleEditMode() {
    this.edited = !this.edited;
  }

  /**
   * Add an event to sort/filter the course list
   */
  filterList() {
    this.subjectFilter.next(this.search);
  }

  /**
   * Really sort the course list
   * @param search the filter to apply
   * @private
   */
  private _filterList(search: string) {
    const filterJson = JSON.stringify(search);
    if (this.previousSearch === filterJson) {
      return;
    }

    this.previousSearch = filterJson;

    this.sortedUsers = this.users
                             .filter(f => {
                                 let ret = true;

                                 ret = ret && (f.username
                                                .concat(f.firstname)
                                                .concat(f.lastname)
                                                .concat(f.email)
                                                .toLowerCase().includes(search.toLowerCase()));

                                 return ret;
                               }
                             )
                             .sort((f1, f2) => {

                               if (f1.username > f2.username) {
                                 return 1;
                               }
                               if (f1.username < f2.username) {
                                 return -1;
                               }
                               return 0;
                             });
  }


}
