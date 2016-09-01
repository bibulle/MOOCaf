import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { CORE_DIRECTIVES } from '@angular/common';

import {ParagraphService} from "../services/paragraph.service";
import {Logger} from "angular2-logger/app/core/logger";
import {NotificationsService} from "angular2-notifications";
import {Paragraph} from "../model/paragraph";
import {FORM_DIRECTIVES} from "@angular/forms";

@Component({
  moduleId: module.id,
  selector: 'page',
  directives: [ ROUTER_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES ],
  templateUrl: 'page.html',
  styleUrls: [ 'page.css' ]
})
export class PageComponent {
  constructor(
    private paragraphService: ParagraphService,
    private _logger: Logger,
    private _service: NotificationsService
  ) { }

  ngOnInit() {
    this._logger.info('Init PageComponent');
    this.getParagraphs();
  }

  getParagraphs() {
    this.paragraphService.getParagraphs().then(paragraphs => {
      console.log(paragraphs);
      return this.markdowns = paragraphs
    });
  }

  markdowns: Paragraph[];
}
