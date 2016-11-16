
import { Subject } from "rxjs";
import { Paragraph } from "./paragraph";
import { Input } from "@angular/core";
import { CourseService } from "../course/course.service";
import { Logger } from "angular2-logger/core";
import { NotificationService } from "../widget/notification/notification.service";
import marked from "marked";
import highlight from "highlight.js";
import { JobService } from "./job.service";

//import * as marked from 'marked';

export abstract class ParagraphAbstractComponent {

  // The queue to manage editor changes
  subjectEditor: Subject<Paragraph>;

  @Input()
  courseId: string;

  @Input()
  paragraphNums: number[];

  @Input()
  data: Paragraph;

  constructor(protected _courseService: CourseService,
              protected _logger: Logger,
              protected _notificationService: NotificationService,
              protected _jobService: JobService) {

    // Synchronous highlighting with highlight.js
    //noinspection TypeScriptUnresolvedFunction
    marked.setOptions({
      highlight: function (code) {
        //noinspection TypeScriptUnresolvedFunction
        return highlight.highlightAuto(code)['value'];
      }
    });

  }

  /**
   * Prepare data to be rendered
   */
  abstract prepareData(): void;

  ngOnInit() {

    this.prepareData();

    if (!this.subjectEditor) {
      this.subjectEditor = new Subject<Paragraph>();
      this.subjectEditor
          .debounceTime(500)
          .subscribe(
            paragraph => {
              //console.log(paragraph);
              return this._courseService.saveParagraph(this.courseId, this.paragraphNums, paragraph)
                         .then(paragraph => {
                           this._notificationService.message("All your modifications have been saved...");
                           this.data = paragraph;
                           this.prepareData();
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

  /**
   * Set this paragraph as done ("read for a markdown" or "checked for a Form" or ...)
   */
  setParagraphAsDone() {
    //this._logger.debug("setParagraphAsDone : "+this.paragraphNums+" -> "+this.data.userDone);
    if (!this.data.userDone) {
      this.data.userDone = new Date();
      this._courseService.saveUserChoice(this.courseId, this.data)
          .then(() => {
            //;
          })
          .catch(err => {
            this._notificationService.error("Error saving your choice", err.status + " : " + err.message);
          });
    }
  }


  static markdownToHTML(markdown: any) {

    if (typeof markdown === "string") {
      return marked(markdown);
    } else if ( markdown.type === "ParagraphContentText") {
      return marked(markdown.content);
    }

  }


}
