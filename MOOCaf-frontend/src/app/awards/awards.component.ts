import { Component, OnInit } from '@angular/core';

import { Logger } from "angular2-logger/core";

import { NotificationService } from "../widget/notification/notification.service";

import { Award } from "./award";
import { AwardService } from "./award.service";
import { UserService } from "../user/user.service";

@Component({
  selector: 'awards',
  templateUrl: './awards.component.html',
  styleUrls: ['./awards.component.css']
})
export class AwardsComponent implements OnInit {

  //noinspection JSMismatchedCollectionQueryUpdate
  private awardsEarned: Award[];
  //noinspection JSMismatchedCollectionQueryUpdate
  private awardsNotEarned: Award[];

  private edited: boolean = false;
  private userIsAdmin: boolean = false;

  constructor(private _logger: Logger,
              private _notificationService: NotificationService,
              private _awardService: AwardService,
              private _userService: UserService) {
  }

  ngOnInit() {
    // check user right
    this._userService.userObservable().subscribe(
      () => {
        this.userIsAdmin = this._userService.isAdmin();
      });


    this._awardService.getAwards()
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
    this._awardService.addAward()
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
   * Sort the awards (percent then level then name)
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
