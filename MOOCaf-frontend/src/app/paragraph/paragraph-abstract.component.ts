
import { Subject } from "rxjs";
import { Paragraph } from "./paragraph";
import { Input } from "@angular/core";
import { CourseService } from "../course/course.service";
import { Logger } from "angular2-logger/core";
import { NotificationService } from "../widget/notification/notification.service";
import * as marked from "marked";
import { JobService } from "./job.service";
import { highlightAuto } from "highlight.js";

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
        return highlightAuto(code)['value'];
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
                           //this.data = paragraph;
                           //this.prepareData();
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

  /**
   * fill a trg object with fields from the source one
   * @param trg
   * @param src
   * @private
   */
  protected _fillObj(trg: any, src: any) {
    for (let k in src) {

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
