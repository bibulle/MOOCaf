import {Component, OnInit, Input} from '@angular/core';

import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/catch";

import {Subject} from "rxjs/Subject";
import {Logger} from "angular2-logger/app/core/logger";
import {NotificationService} from "../../services/notification.service";

import {ParagraphAbstract} from "../paragraph/paragraph-abstract";
import {Paragraph} from "../../models/paragraph";
import {ParagraphContentType} from "../../models/paragraph-content-type.enum";
import {CourseService} from "../../services/course.service";

@Component({
  moduleId: module.id,
  selector: 'paragraph-form',
  //inputs: ['data'],
  templateUrl: 'paragraph-form.html',
  styleUrls: ['../paragraph/paragraph.css', 'paragraph-form.css'],
})

export class ParagraphFormComponent extends ParagraphAbstract implements OnInit {

  @Input()
  data: Paragraph;

  @Input()
  test;

  @Input()
  courseId: string;

  // The queue to manage user choices
  private subjectParagraph: Subject<Paragraph>;

  // the constructor
  constructor(private _courseService: CourseService,
              private _logger: Logger,
              private _notificationService: NotificationService) {
    super();

  }

// Initialisation
  ngOnInit() {

    this.data.id = this.data['_id'];

    console.log(this.data);

    // Used to get access of the enum in the template (won't be in the model)
    this.data.paragraphContentType = ParagraphContentType;

    // if no user choice for checkbox type, init with empty array
    if (this.data.userChoice == null) {
      for (let paragraph of this.data.content) {
        //if (paragraph.type == ParagraphContentType[ParagraphContentType.Checkbox]) {
        if (paragraph.type == ParagraphContentType.Checkbox) {
          this.data.userChoice = [];
        }
      }
    }

    // if no user check count... init to zero
    if (this.data.userCheckCount == null) {
      this.data.userCheckCount = 0;
    }

    // Change Markdown to HTM in each label
    if (this.data.content) {
      for (let c of this.data.content) {
        if (c['label']) {
          c['label'] = ParagraphAbstract.markdownToHTML(c['label']).replace(/^<p>(.*)<\/p>[\r\n]*$/, "$1");
        }
      }
    }

    //console.log(this.data.id+" "+this.data.userChoice);

    // Save user choice changes
    if (!this.subjectParagraph) {
      this.subjectParagraph = new Subject<Paragraph>();
      this.subjectParagraph
        .debounceTime(500)
        .subscribe(
          paragraph => {
            //console.log(paragraph);
            return this._courseService.saveUserChoice(this.courseId, paragraph)
              .then(paragraph => {
                this._notificationService.message("All your modifications have been saved...")
                this.data.userChoice = paragraph.userChoice;
                this.data.userCheckCount = paragraph.userCheckCount;
                this.data.userCheckOK = paragraph.userCheckOK;
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


  }

// Is the paragraph closed (interface should then be disabled)
  isClosed(paragraph) {
    return (paragraph.userCheckOK === true) || (paragraph.userCheckCount >= paragraph.maxCheckCount)
  }

// In case of chekbox, create the user choices as an array of selected items
  checkboxChanged(event) {
    // remove the value from the result
    var index = this.data.userChoice.indexOf(event.target.value, 0);
    if (index > -1) {
      this.data.userChoice.splice(index, 1);
    }

    // add it if needed
    if (event.target.checked) {
      this.data.userChoice.push(event.target.value);
    }

    this.saveUserChoice();

  }

// save the user choices
  saveUserChoice() {
    this.subjectParagraph
      .next(this.data);
  }

// check user choice
  checkUserChoice() {
    // Send this to the backend
     this._courseService
       .checkUserChoice(this.courseId, this.data)
       .then(modifiedParagraph => {
         //this._logger.debug(modifiedParagraph);
        // Update the paragraph
         this.data.userChoice = modifiedParagraph.userChoice;
         this.data.userCheckCount = modifiedParagraph.userCheckCount;
         this.data.userCheckOK = modifiedParagraph.userCheckOK;
       })
       .catch(error => {
         this._logger.error(error);
         this._notificationService.error("Cannot check", (error.message || error));
       });

  }

}
