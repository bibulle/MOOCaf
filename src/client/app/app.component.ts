import { Component, OnInit } from '@angular/core';

import {Logger} from "angular2-logger/core";
import {NotificationsService, SimpleNotificationsModule, SimpleNotificationsComponent} from "angular2-notifications";

import {Paragraph} from "./model/paragraph";
import {ParagraphService} from "./services/paragraph.service";
import {ParagraphComponent} from "./paragraph/paragraph.component";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ParagraphComponent, SimpleNotificationsComponent],
  providers: [ParagraphService]
})
export class AppComponent implements OnInit {

  // notification options
  public options = {
    timeOut: 3000,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    showProgressBar: true,
    pauseOnHover: true,
    preventDuplicates: false,
    preventLastDuplicates: "visible",
    rtl: false,
    animate: "scale",
    position: ["right", "bottom"]
  };

  constructor(
    private paragraphService: ParagraphService,
    private _logger: Logger,
    private _service: NotificationsService
  ) { }

  ngOnInit() {
    this._logger.info('Init AppComponent');
    this.getParagraphs();
  }

  getParagraphs() {
    this.paragraphService.getParagraphs().then(paragraphs => this.markdowns = paragraphs);
  }

  markdowns: Paragraph[];
}
