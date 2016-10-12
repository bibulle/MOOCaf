import {Component} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {Logger} from "angular2-logger/core";
import {NotificationService} from "../../services/notification.service";
import {UserService} from "../../services/user.service";
import {Award} from "../../models/award";

@Component({
  moduleId: module.id,
  selector: 'awards',
  templateUrl: 'awards.html',
  styleUrls: ['awards.css']
})

export class AwardsComponent {

  private awardsEarned: Award[];
  private awardsNotEarned: Award[];

  edited: boolean = false;

  constructor(private _logger: Logger,
              private _notificationService: NotificationService,
              private _userService: UserService) {
  }

  ngOnInit() {

    this._userService.getAwards()
      .then(awards => {

        this.awardsEarned = this._sort(awards.filter(a => {
          return a.limitCount <= a.userCount;
        }));
        this.awardsNotEarned = this._sort(awards.filter(a => {
          return a.limitCount >  a.userCount;
        }));

      })
      .catch(err => {
        this._notificationService.error("Error", err)
      });

  }


  toggleEditMode() {
    this.edited = !this.edited;
  }


  private _sort(awards: Award[]) {
    return awards.sort((a, b) => {

      let aPercent = Math.min(1, a.userCount / a.limitCount);
      let bPercent = Math.min(1, b.userCount / b.limitCount);

      if (aPercent > bPercent) {
        return -1;
      } else if (aPercent < bPercent) {
        return 1;
      }

      if (a.level > b.level) {
        return -1;
      } else if (a.level < b.level) {
        return 1
      }

      if (a.name > b.name) {
        return 1;
      } else {
        return -1;
      }
    });
  }

}
