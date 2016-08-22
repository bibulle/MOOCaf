import { Component, OnInit } from '@angular/core';

import {Logger} from "angular2-logger/core";

import {Paragraph} from "./model/paragraph";
import {ParagraphService} from "./services/paragraph.service";
import {ParagraphComponent} from "./paragraph/paragraph.component";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ParagraphComponent],
  providers: [ParagraphService]
})
export class AppComponent implements OnInit {

  constructor(
    private paragraphService: ParagraphService,
    private _logger: Logger
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
