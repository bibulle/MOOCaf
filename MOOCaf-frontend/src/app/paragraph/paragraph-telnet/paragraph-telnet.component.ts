import { Component, OnInit } from '@angular/core';
import { ParagraphAbstractComponent } from "../paragraph-abstract.component";
import { NotificationService } from "../../widget/notification/notification.service";
import { Logger } from "angular2-logger/core";
import { CourseService } from "../../course/course.service";
import { Subject } from "rxjs";
import { Paragraph } from "../paragraph";

@Component({
  selector: 'paragraph-telnet',
  templateUrl: './paragraph-telnet.component.html',
  styleUrls: ['../paragraph.component.css', './paragraph-telnet.component.css']
})
export class ParagraphTelnetComponent extends ParagraphAbstractComponent implements OnInit {




  // The queue to manage user choices
  private subjectParagraph: Subject<Paragraph>;




  // the constructor
  constructor(_courseService: CourseService,
              _logger: Logger,
              _notificationService: NotificationService) {
    super(
      _courseService,
      _logger,
      _notificationService
    );
  }


  ngOnInit() {
    super.ngOnInit();

    // ----------
    // Save user choice changes to Db
    // ----------
    if (!this.subjectParagraph) {
      this.subjectParagraph = new Subject<Paragraph>();
      this.subjectParagraph
          .debounceTime(500)
          .subscribe(
            paragraph => {
              //console.log(paragraph);
              return this._courseService.saveUserChoice(this.courseId, paragraph)
                         .then(paragraph => {
                           this._notificationService.message("All your modifications have been saved...");
                           this.data.userChoice = paragraph.userChoice;
                           this.data.userCheckCount = paragraph.userCheckCount;
                           this.data.userCheckOK = paragraph.userCheckOK;
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

  }


  prepareData(): void {
    //this._logger.debug(this.data);
    this._markdownToHtml();
    this._addMissingValues();
  }


  /**
   * save the user choices
   */
  saveUserChoice() {
    this.subjectParagraph
        .next(this.data);
  }


  /**
   * test the user choices
   */
  testUserChoice() {
    // Send this to the backend
    this._courseService
        .testUserChoice(this.courseId, this.data)
        .then(modifiedParagraph => {
          //this._logger.debug(modifiedParagraph);
          // Update the paragraph
          this.data.userChoice = modifiedParagraph.userChoice;
          this.data.userChoiceReturn = modifiedParagraph.userChoiceReturn;
        })
        .catch(error => {
          this._logger.error(error);
          this._notificationService.error("Cannot test", (error.statusText || error.message || error.error || error));
        });

  }

  /**
   * check the user choices
   */
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
          this.data.answer = modifiedParagraph.answer;
          this.data.userDone = modifiedParagraph.userDone;
        })
        .catch(error => {
          this._logger.error(error);
          this._notificationService.error("Cannot check", (error.statusText || error.message || error.error || error));
        });

  }



  /**
   * Is the paragraph closed (interface should then be disabled)
   * @param paragraph
   * @returns {boolean}
   */
  isClosed(paragraph) {
    return (paragraph.userCheckOK === true) || (paragraph.userCheckCount >= paragraph.maxCheckCount)
  }


  /**
   * add to data the _html field from the markdown one
   * @private
   */
  private _markdownToHtml() {
    // Change Markdown to HTM in label
    this.data.content['label_html'] = ParagraphAbstractComponent.markdownToHTML(this.data.content['label']).replace(/^<p>(.*)<\/p>[\r\n]*$/, "$1");

    // idem into the questions
    if (this.data.content['questions']) {
      let questions = this.data.content['questions'] as any[];
      this.data.content['questions_html'] = questions.map(s => {
        return ParagraphAbstractComponent.markdownToHTML(s).replace(/^<p>(.*)<\/p>[\r\n]*$/, "$1")
      })
    }
    if (this.data.content['question']) {
      this.data.content['question_html'] = ParagraphAbstractComponent.markdownToHTML(this.data.content['question']).replace(/^<p>(.*)<\/p>[\r\n]*$/, "$1")
    }
  }

  /**
   * Add missing values to data to allowed a correct UI
   * @private
   */
  private _addMissingValues() {
    this.data.id = this.data['_id'];

    // if no user check count... init to zero
    if (this.data.userCheckCount == null) {
      this.data.userCheckCount = 0;
    }

  }


}
