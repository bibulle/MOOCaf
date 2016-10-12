import {Component} from "@angular/core";
import {Course} from "../../models/course";
import {Subject} from "rxjs/Subject";
import {Logger} from "angular2-logger/core";
import {CourseService} from "../../services/course.service";
import {NotificationService} from "../../services/notification.service";
import {UserService} from "../../services/user.service";
import {Award} from "../../models/award";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  moduleId: module.id,
  selector: 'awards',
  templateUrl: 'awards.html',
  styleUrls: ['awards.css']
})

export class AwardsComponent {

  private awards: Award[];


  constructor(private _logger: Logger,
              private _notificationService: NotificationService,
              private _userService: UserService,
              private _sanitizer: DomSanitizer) {
  }

  ngOnInit() {

    this._userService.getAwards()
      .then(awards => {

        this.awards = awards.sort((a, b) => {

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


        // foreach, calculate the clipping zone
        this.awards.forEach(award => {
          let ratio = 0;
          if (award.limitCount != 0) {
            ratio = Math.floor(100 * award.userCount / award.limitCount);
          }
          // vertical
          //let path = 'polygon(0 0, '+ratio+'% 0, '+ratio+'% 100%, 0 100%)';
          // horizontal
          //let path = 'polygon(0 100%, 0 '+(100-ratio)+'%, 100% '+(100-ratio)+'%, 100% 100%)';
          // arc
          let cos = Math.cos(Math.PI * (1 - ratio / 100));
          let sin = Math.sin(Math.PI * (1 - ratio / 100));
          let path = 'polygon(50% 50%, ' + Math.round(50 - 190 * sin) + '% ' + Math.round(50 - 190 * cos) + '%, -150% 0%, -150% 250%, 250% 250%, 250% 0%, ' + Math.round(50 + 190 * sin) + '% ' + Math.round(50 - 190 * cos) + '%)';

          award['clipping'] = this._sanitizer.bypassSecurityTrustStyle('-webkit-clip-path: ' + path + ';clip-path: ' + path + ';');
        });


        this._logger.debug(awards);
      })
      .catch(err => {
        this._notificationService.error("Error", err)
      });

  }
}
