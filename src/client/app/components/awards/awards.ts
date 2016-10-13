import {Component} from "@angular/core";
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

  //noinspection JSMismatchedCollectionQueryUpdate
  private awardsEarned: Award[];
  //noinspection JSMismatchedCollectionQueryUpdate
  private awardsNotEarned: Award[];

  edited: boolean = false;

  constructor(private _logger: Logger,
              private _notificationService: NotificationService,
              private _userService: UserService) {
  }

  ngOnInit() {

    this._userService.getAwards()
      .then(awards => {
        this._filterAwards(awards);

      })
      .catch(err => {
        this._notificationService.error("Error", err)
      });

  }


  toggleEditMode() {
    this.edited = !this.edited;
  }

  /**
   * Add an award
   * @private
   */
  addAward() {
    this._userService.addAward()
      .then(awards => {
        this._notificationService.message("All your modifications have been saved...");

        this.onAwardsChange(awards);

      })
      .catch(error => {
        this._logger.error(error);
        this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error.error || error));
      });
  }

  /**
   * THe award list has changed
   * @param awards
   */
  onAwardsChange(awards: Award[]) {
    this._filterAwards(awards);

  }


  /**
   * Filter awards between the two lists (earned an d next)
   * @param awards
   * @private
   */
  private _filterAwards(awards: Award[]) {
    this.awardsEarned = this._sort(awards.filter(a => {
      return a.limitCount <= a.userCount;
    }));
    this.awardsNotEarned = this._sort(awards.filter(a => {
      return a.limitCount > a.userCount;
    }));
  }

  /**
   * Sort the awards
   * @param awards
   * @returns {Award[]}
   * @private
   */
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
