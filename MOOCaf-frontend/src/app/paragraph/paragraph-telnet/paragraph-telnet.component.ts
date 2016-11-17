import { Component, OnInit, ElementRef, AfterViewInit } from "@angular/core";
import { ParagraphAbstractComponent } from "../paragraph-abstract.component";
import { NotificationService } from "../../widget/notification/notification.service";
import { Logger } from "angular2-logger/core";
import { CourseService } from "../../course/course.service";
import { Subject } from "rxjs";
import { Paragraph } from "../paragraph";
import { Job, JobStatus } from "../job";
import { JobService } from "../job.service";

@Component({
  selector: 'paragraph-telnet',
  templateUrl: './paragraph-telnet.component.html',
  styleUrls: ['../paragraph.component.css', './paragraph-telnet.component.css']
})
export class ParagraphTelnetComponent extends ParagraphAbstractComponent implements OnInit, AfterViewInit {


  editableJson: string;
  editorInError = false;

  // The previous Json value
  private _previousJson = "";

  isRunning = false;


  // The queue to manage user choices
  private subjectParagraph: Subject<Paragraph>;


  // the constructor
  constructor(_courseService: CourseService,
              _logger: Logger,
              _notificationService: NotificationService,
              _jobService: JobService,
              private _el: ElementRef) {
    super(
      _courseService,
      _logger,
      _notificationService,
      _jobService
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


    //this._logger.debug(this._el.nativeElement.querySelector('pre'));

  }

  //noinspection JSUnusedGlobalSymbols
  ngAfterViewInit() {
    // Initially, scroll to bottom
    this.scrollReturnToBottom(true);
  }

  scrollReturnToBottom(forced: boolean) {
    // if we are at the end of the return view, scroll after change has been done
    if (this._el.nativeElement.querySelector('pre')) {
      if (forced || (this._el.nativeElement.querySelector('pre').scrollTop+this._el.nativeElement.querySelector('pre').clientHeight >= this._el.nativeElement.querySelector('pre').scrollHeight)) {
        setTimeout(() => {
          this._el.nativeElement.querySelector('pre').scrollTop = this._el.nativeElement.querySelector('pre').scrollHeight;
        },100);
      }
    }
  }

  prepareData(): void {
    //this._logger.debug(this.data);
    this._markdownToHtml();
    this._addMissingValues();
    this._addEditableJson();
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
    this.isRunning = true;
    // Send this to the backend
    this._courseService
        .testUserChoice(this.courseId, this.data)
        .then(job => {
          this.manageJob(job);
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
        .then(job => {
          this.manageJob(job);
        })
        .catch(error => {
          this._logger.error(error);
          this._notificationService.error("Cannot check", (error.statusText || error.message || error.error || error));
        });

  }


  manageJob(job: Job) {
    //this._logger.debug(job);

    // Update the paragraph
    this.data.userChoice = job.result.userChoice;
    this.data.userChoiceReturn = job.result.userChoiceReturn;
    this.data.userCheckCount = job.result.userCheckCount;
    this.data.userCheckOK = job.result.userCheckOK;
    this.data.answer = job.result.answer;
    this.data.userDone = job.result.userDone;
    this.prepareData();

    this.scrollReturnToBottom(false);

    if (job.status == JobStatus.Continue) {

      setTimeout(() => {

          //this._logger.debug("timeout");
          this._jobService.getJob(job.id)
              .then(job => {
                this.manageJob(job);
              })
              .catch(error => {
                this._logger.error(error);
                this._notificationService.error("Error", (error.statusText || error.message || error.error || error));
              });

        },
        5000);
    }

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

    // if is still running, add the variable
    this.isRunning = (this.data.userChoiceReturn && this.data.userChoiceReturn.match('class="running"'));

  }

  /**
   * Add json version of the data for the editor
   * @private
   */
  private _addEditableJson() {
    this.editableJson = JSON.stringify(
      this.data,
      (key, value) => {
        if (["_id", "label_html", "question_html", "id", "paragraphContentType", "updated", "created", "type"].indexOf(key) >= 0) {
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
