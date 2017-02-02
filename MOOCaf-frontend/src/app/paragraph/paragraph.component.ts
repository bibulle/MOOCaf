import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CoursePart } from "../course/course";
import { Paragraph } from "./paragraph";
import { Logger } from "angular2-logger/core";
import { CourseService } from "../course/course.service";
import { NotificationService } from "../widget/notification/notification.service";
import { ParagraphType } from "./paragraph-type.enum";
import { ParagraphContentType } from "./paragraph-content-type.enum";

@Component({
  selector: 'paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.css']
})
export class ParagraphComponent implements OnInit {

  @Input()
  courseId: string;

  @Input()
  selectedPartNums: number[];

  @Input()
  paragraphNum: number;

  @Input()
  paragraphCount: number;

  // path to the paragraph
  paragraphNums: number[];

  @Output()
  notifySelectedPart: EventEmitter<CoursePart> = new EventEmitter<CoursePart>();

  private deleteParagraphClicked: boolean = false;
  private addParagraphClicked: boolean = false;

  // added to help templating with enums
  ParagraphType = ParagraphType;

  @Input()
  data: Paragraph;

  @Input()
  edited: boolean;

  constructor(private _logger: Logger,
              private _courseService: CourseService,
              private _notificationService: NotificationService) {
  }

  ngOnInit() {

    if (this.data) {
      this.data = this.data as Paragraph;
      //console.log(this.data);

      this.paragraphNums = this.selectedPartNums.slice();
      this.paragraphNums.push(this.paragraphNum);
    }
  }

  moveUp() {
    //this._logger.debug("moveUp");
    this._move(-1);
  }

  moveDown() {
    //this._logger.debug("moveDown");
    this._move(+1);
  }

  /**
   * Move a part
   * @param direction (+1 for down or -1 for up)
   * @private
   */
  _move(direction: number) {

    let newParagraphNum = this.paragraphNum + direction;

    this._courseService.moveParagraph(this.courseId, this.paragraphNums, newParagraphNum)
        .then(coursePart => {
          this._notificationService.message("All your modifications have been saved...");

          this.notifySelectedPart.emit(coursePart)
        })
        .catch(error => {
          this._logger.error(error);
          this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error.error || error));
        });
  }


  private addParagraphClickedTimeout;

  addParagraphSibling(typeS: string) {
    //this._logger.debug("addParagraphSibling(" + typeS + ")");

    if (!typeS) {
      this.addParagraphClicked = !this.addParagraphClicked;
      if (this.addParagraphClicked) {
        this.addParagraphClickedTimeout = setTimeout(() => {
            this.addParagraphClicked = false;
          },
          5000);
      } else {
        clearTimeout(this.addParagraphClickedTimeout);
      }
      return;
    }

    let type: ParagraphType;
    let subType: ParagraphContentType;
    switch (typeS) {
      case "markdown":
        type = ParagraphType.MarkDown;
        break;
      case "question-check":
        type = ParagraphType.Form;
        subType = ParagraphContentType.Checkbox;
        break;
      case "question-radio":
        type = ParagraphType.Form;
        subType = ParagraphContentType.Radio;
        break;
      case "question-text":
        type = ParagraphType.Form;
        subType = ParagraphContentType.Text;
        break;
      case "telnet":
        type = ParagraphType.Telnet;
        break;
      case "java":
        type = ParagraphType.Java;
        break;
      default:
        this._notificationService.error("System error !!", "Unknown type : '" + typeS + "'");
        return;
    }

    let newPartNums = this.paragraphNums.slice(0, -1);
    newPartNums.push(this.paragraphNums[this.paragraphNums.length - 1] + 1);

    this._courseService.addParagraph(this.courseId, newPartNums, type, subType)
        .then(coursePart => {
          this._notificationService.message("All your modifications have been saved...");

          this.notifySelectedPart.emit(coursePart)
        })
        .catch(error => {
          this._logger.error(error);
          this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error.error || error));
        });
  }

  deleteParagraph() {
    if (!this.deleteParagraphClicked) {
      this.deleteParagraphClicked = true;
      setTimeout(() => {
          this.deleteParagraphClicked = false;
        },
        3000);
    } else {
      this.deleteParagraphClicked = false;
      this._courseService.deleteParagraph(this.courseId, this.paragraphNums)
          .then(coursePart => {
            this._notificationService.message("All your modifications have been saved...");

            this.notifySelectedPart.emit(coursePart)
          })
          .catch(error => {
            this._logger.error(error);
            this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error.error || error));
          });
    }
  }

}
