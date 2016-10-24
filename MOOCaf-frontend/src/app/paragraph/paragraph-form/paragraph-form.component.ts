import { Component, OnInit } from '@angular/core';
import { ParagraphAbstractComponent } from "../paragraph-abstract.component";
import { Subject } from "rxjs";
import { Paragraph } from "../paragraph";
import { CourseService } from "../../course/course.service";
import { Logger } from "angular2-logger/core";
import { NotificationService } from "../../widget/notification/notification.service";
import { ParagraphContentType } from "../paragraph-content-type.enum";

@Component({
  selector: 'paragraph-form',
  templateUrl: './paragraph-form.component.html',
  styleUrls: ['../paragraph.component.css', './paragraph-form.component.css']
})

export class ParagraphFormComponent extends ParagraphAbstractComponent implements OnInit {

  editableJson: string;
  editorInError = false;

  // The previous Json value
  private _previousJson = "";



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

// Initialisation
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
                           this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error));
                         });
            },
            error => {
              this._logger.error(error)
            }
          );
    }


  }

  /**
   * Prepare data to be rendered
   */
  prepareData(): void {
    this._addMissingValues();
    this._markdownToHtml();
    this._addEditableJson();
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
   * checkbox has been changed (create the user choices as an array of selected items)
   * @param event
   */
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

  /**
   * save the user choices
   */
  saveUserChoice() {
    this.subjectParagraph
        .next(this.data);
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
          this._notificationService.error("Cannot check", (error.message || error));
        });

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

        this._fillObj(this.data, obj);

        this._markdownToHtml();

        this.editorInError = false;

        this.subjectEditor
            .next(this.data);

      } catch (ex) {
        this.editorInError = true;
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


  /**
   * Add missing values to data to allowed a correct UI
   * @private
   */
  private _addMissingValues() {
    this.data.id = this.data['_id'];

    // Used to get access of the enum in the template (won't be in the model)
    this.data.paragraphContentType = ParagraphContentType;

    // if no user choice for checkbox type, init with empty array
    if (this.data.userChoice == null) {
      if (this.data.content['type'] == "" + ParagraphContentType.Checkbox) {
        this.data.userChoice = [];
      }
    }

    // if no user check count... init to zero
    if (this.data.userCheckCount == null) {
      this.data.userCheckCount = 0;
    }

    // no size to text... set it to 20 (default value)
    if ((this.data.content['type'] == "" + ParagraphContentType.Text) && !this.data.content['size']) {
      this.data.content['size'] = 20;
    }
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
   * Add json version of the data for the editor
   * @private
   */
  private _addEditableJson() {
    this.editableJson = JSON.stringify(
      this.data,
      (key, value) => {
        if (["_id", "label_html", "questions_html", "question_html", "id", "paragraphContentType", "updated", "created", "type"].indexOf(key) >= 0) {
          return undefined;
        }

        if (key.startsWith("user")) {
          return undefined
        }

        // if calculated html exit, remove it
        if (value && value.raw && value.html) {
          return value.raw
        }
        return value;
      },
      2);
    this._previousJson = this.editableJson;
  }


}
