import {Component, OnInit, Input} from '@angular/core';
import {Subject} from "rxjs/Subject";
//import {Logger} from "angular2-logger/core";

import {Paragraph} from "../../models/paragraph";
import {ParagraphAbstract} from "../paragraph/paragraph-abstract";
import {NotificationService} from "../../services/notification.service";
import {Logger} from "angular2-logger/core";
import {CourseService} from "../../services/course.service";

@Component({
  moduleId: module.id,
  selector: 'paragraph-markdown',
  //inputs: [ 'data' ],
  templateUrl: 'paragraph-markdown.html',
  styleUrls: ['../paragraph/paragraph.css', 'paragraph-markdown.css']
})

export class ParagraphMarkdownComponent extends ParagraphAbstract implements OnInit {

  html: string = "";

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
    //this._logger.debug(this.data);


  }

  /**
   * Prepare data to be rendered
   */
  prepareData(): void {
    if (this.data && this.data.content) {
      this.html = ParagraphAbstract.markdownToHTML(this.data.content.toString());
    }
  }


  /**
   * The editor field has been changed
   */
  editorChange() {
    this.html = ParagraphAbstract.markdownToHTML(this.data.content.toString());
    this.subjectEditor
      .next(this.data);
  }
}
