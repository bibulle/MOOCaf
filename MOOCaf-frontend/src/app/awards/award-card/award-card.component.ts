import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Award } from "../award";
import { SafeStyle, DomSanitizer } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { AwardService } from "../award.service";
import { Logger } from "angular2-logger/core";
import { NotificationService } from "../../widget/notification/notification.service";

@Component({
  selector: 'award-card',
  templateUrl: './award-card.component.html',
  styleUrls: ['./award-card.component.css']
})
export class AwardCardComponent implements OnInit {

  @Input()
  private award: Award;

  @Input()
  edited: boolean = false;

  clippingZone: SafeStyle;


  @Output()
  notifyAwardsChange: EventEmitter<Award[]> = new EventEmitter<Award[]>();


  private deleteAwardClicked: boolean = false;

  editableJson: string;
  editorInError = false;

  // The previous Json value for the editor
  private _previousJson = "";


  // The queue to manage editor changes
  subjectEditor: Subject<Award>;


  constructor(private _logger: Logger,
              private _notificationService: NotificationService,
              private _awardService: AwardService,
              private _sanitizer: DomSanitizer) { }

  /**
   * Init the award
   */
  ngOnInit() {

    this._addEditableJson();
    this._addClippingZone();

    // What to do on edition ?
    if (!this.subjectEditor) {
      this.subjectEditor = new Subject<Award>();
      this.subjectEditor
          .debounceTime(500)
          .subscribe(
            award => {
              //console.log(award);
              return this._awardService.saveAward(award)
                         .then(award => {
                           this._notificationService.message("All your modifications have been saved...");
                           this.award = award;

                           this._addEditableJson();
                           this._addClippingZone();
                         })
                         .catch(error => {
                           this._logger.error(error);
                           this._notificationService.error("Error saving you changes !!", (error.statusText || error.message || error.error || error));
                         });
            },
            error => {
              this._logger.error(error)
            }
          );
    }


    //this._logger.debug(awards);

  }

  /**
   * Add the clippingZone
   * @private
   */
  private _addClippingZone() {
    // calculate the clipping zone
    let ratio = 0;
    if (this.award.limitCount != 0) {
      ratio = Math.floor(100 * this.award.userCount / this.award.limitCount);
    }
    ratio = Math.min(100, ratio);
    // vertical
    //let path = 'polygon(0 0, '+ratio+'% 0, '+ratio+'% 100%, 0 100%)';
    // horizontal
    //let path = 'polygon(0 100%, 0 '+(100-ratio)+'%, 100% '+(100-ratio)+'%, 100% 100%)';
    // arc
    let cos = Math.cos(Math.PI * (1 - ratio / 100));
    let sin = Math.sin(Math.PI * (1 - ratio / 100));
    let path = 'polygon(50% 50%, ' + Math.round(50 - 190 * sin) + '% ' + Math.round(50 - 190 * cos) + '%, -150% 0%, -150% 250%, 250% 250%, 250% 0%, ' + Math.round(50 + 190 * sin) + '% ' + Math.round(50 - 190 * cos) + '%)';

    //this._logger.debug(this.award.name+" "+ratio);
    this.clippingZone = this._sanitizer.bypassSecurityTrustStyle('-webkit-clip-path: ' + path + ';clip-path: ' + path + ';');

  }

  /**
   * Add json version of the data for the editor
   * @private
   */
  private _addEditableJson() {
    this.editableJson = JSON.stringify(
      this.award,
      (key, value) => {
        // if (["_id", "label_html", "questions_html", "question_html", "id", "paragraphContentType", "updated", "created", "type"].indexOf(key) >= 0) {
        if (["_id", "id", "updated", "created", "__v", "userCount"].indexOf(key) >= 0) {
          return undefined;
        }
        return value;
      },
      2);
    this._previousJson = this.editableJson;
    this.editorInError = false;
  }

  /**
   * The editor field has been changed
   */
  editorChange() {
    var obj: any;

    if (this._previousJson !== this.editableJson) {
      this._previousJson = this.editableJson;
      try {
        obj = JSON.parse(this.editableJson);

        this._fillObj(this.award, obj);

        //this._addEditableJson(award);
        this._addClippingZone();

        this.editorInError = false;

        this.subjectEditor
            .next(this.award);

      } catch (ex) {
        this.editorInError = true;
        this._logger.debug(ex);
      }

    }
  }

  /**
   * remove this award
   */
  deleteAward() {
    if (!this.deleteAwardClicked) {
      this.deleteAwardClicked = true;
      setTimeout(() => {
          this.deleteAwardClicked = false;
        },
        3000);
    } else {
      this.deleteAwardClicked = false;
      this._awardService.deleteAward(this.award)
          .then(awards => {
            this._notificationService.message("All your modifications have been saved...");

            this.notifyAwardsChange.emit(awards)
          })
          .catch(error => {
            this._logger.error(error);
            this._notificationService.error("Error saving you changes !!", (error.statusText || error.message || error.error || error));
          });
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
      if (src.hasOwnProperty(k) && typeof k !== 'function') {
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

}
