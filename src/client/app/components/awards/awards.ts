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

  edited: boolean = false;

  // The queue to manage editor changes
  subjectEditor: Subject<Award>;


  constructor(private _logger: Logger,
              private _notificationService: NotificationService,
              private _userService: UserService,
              private _sanitizer: DomSanitizer) {
  }

  ngOnInit() {

    this._userService.getAwards()
      .then(awards => {

        // Sort the list
        this.awards = this._sort(awards);


        // foreach prepare data
        this.awards.forEach(award => {
          this._addEditableJson(award);
          this._addClippingZone(award);
         });

        // What to do on edition ?
        if (!this.subjectEditor) {
          this.subjectEditor = new Subject<Award>();
          this.subjectEditor
            .debounceTime(500)
            .subscribe(
              award => {
                //console.log(award);
                return this._userService.saveAward(award)
                  .then(awards => {
                    this._notificationService.message("All your modifications have been saved...");
                    this.awards = this._sort(awards);
                    // foreach prepare data
                    this.awards.forEach(award => {
                      this._addEditableJson(award);
                      this._addClippingZone(award);
                    });
                  })
                  .catch(error => {
                    this._logger.error(error);
                    this._notificationService.error("System error !!", "Error saving you changes !!\n\t" +(error.message || error));
                  });
              },
              error => {
                this._logger.error(error)
              }
            );
        }


        //this._logger.debug(awards);
      })
      .catch(err => {
        this._notificationService.error("Error", err)
      });

  }


  toggleEditMode() {
    this.edited = !this.edited;
  }


  private _addClippingZone(award: Award) {
    // calculate the clipping zone
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

  /**
   * Add json version of the data for the editor
   * @private
   */
  private _addEditableJson(award: Award) {
    award['editableJson'] = JSON.stringify(
      award,
      (key, value) => {
        // if (["_id", "label_html", "questions_html", "question_html", "id", "paragraphContentType", "updated", "created", "type"].indexOf(key) >= 0) {
        if (["_id", "id", "updated", "created", "__v", "userCount"].indexOf(key) >= 0) {
          return undefined;
        }
        return value;
      },
      2);
    award['_previousJson'] = award['editableJson'];
    award['editorInError'] = false;
  }

  /**
   * The editor field has been changed
   */
  editorChange(award) {
    var obj: any;

    if (award['_previousJson'] !== award['editableJson']) {
      award['_previousJson'] = award['editableJson'];
      try {
        obj = JSON.parse(award['editableJson']);

        this._fillObj(award, obj);

        //this._addEditableJson(award);
        this._addClippingZone(award);

        award['editorInError'] = false;

         this.subjectEditor
           .next(award);

      } catch (ex) {
        award['editorInError'] = true;
        this._logger.debug(ex);
      }

    }
  }


  /**
   * fill a trg object with fields from the source one
   * @param trg
   * @param src
   * @private
   */
  private _fillObj(trg: any, src: any) {
    for (var k in src) {

      if (src[k] instanceof Array) {
        if (!trg[k] || !(trg[k] instanceof Array)) {
          trg[k] = [];
        }
        this._fillObj(trg[k], src[k]);
      } else if ((typeof src[k]) === 'object') {
        if (!trg[k] || ((typeof trg[k]) !== 'object')) {
          trg[k] = {};
        }
        this._fillObj(trg[k], src[k]);
      } else {

        trg[k] = src[k];
      }
    }

  }


}
