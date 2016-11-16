import { Component, OnInit } from '@angular/core';
import { ParagraphAbstractComponent } from "../paragraph-abstract.component";
import { VisibilityEvent } from "../../widget/scroll-detector/visible.directive";
import { NotificationService } from "../../widget/notification/notification.service";
import { Logger } from "angular2-logger/core";
import { CourseService } from "../../course/course.service";
import { JobService } from "../job.service";

@Component({
  selector: 'paragraph-markdown',
  templateUrl: './paragraph-markdown.component.html',
  styleUrls: ['../paragraph.component.css', './paragraph-markdown.component.css']
})
export class ParagraphMarkdownComponent extends ParagraphAbstractComponent implements OnInit {

  html: string = "";

  // for previous value in the editor
  private _previousValue = "";


  constructor(_courseService: CourseService,
              _logger: Logger,
              _notificationService: NotificationService,
              _jobService: JobService) {
    super(
      _courseService,
      _logger,
      _notificationService,
      _jobService
    );

  }

  ngOnInit() {
    super.ngOnInit();
    //this._logger.debug(this.data);


  }

  /**
   * Prepare data to be rendered
   */
  prepareData(): void {
    if (this.data && this.data.content) {
      this.html = ParagraphAbstractComponent.markdownToHTML(this.data.content.toString());
      this._previousValue = this.data.content.toString();
    }
  }


  /**
   * The editor field has been changed
   */
  editorChange() {
    if (this._previousValue !== this.data.content.toString()) {
      this._previousValue = this.data.content.toString();
      this.html = ParagraphAbstractComponent.markdownToHTML(this.data.content.toString());
      this.subjectEditor
          .next(this.data);
    }
  }

  /**
   * THis markdown visibility change... has it been seen ?
   * @param event
   */
  visibilityChange(event:VisibilityEvent) {
    //this._logger.debug("visibilityChange");

    // Is it visible ?
    if (event.bottomVisible) {

      this.setParagraphAsDone();

    }
  }



}
