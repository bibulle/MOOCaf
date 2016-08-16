import { Component, OnInit } from '@angular/core';

import { ParagraphMarkdownComponent } from './paragraph-markdown/paragraph-markdown.component'
import {Paragraph} from "./paragraph";
import {ParagraphService} from "./paragraph.service";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ParagraphMarkdownComponent],
  providers: [ParagraphService]
})
export class AppComponent implements OnInit {

  constructor(private paragraphService: ParagraphService) { }

  ngOnInit() {
    this.getParagraphs();
  }

  getParagraphs() {
    this.paragraphService.getParagraphs().then(paragraphs => this.markdowns = paragraphs);
  }

  markdowns: Paragraph[];
}
