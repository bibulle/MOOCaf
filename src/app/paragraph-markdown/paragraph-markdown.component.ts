import {Component, OnInit, Input} from '@angular/core';
import {Paragraph} from "../model/paragraph";

import {ParagraphAbstract} from "../paragraph-abstract.component";

@Component({
  moduleId: module.id,
  selector: 'app-paragraph-markdown',
  inputs: [ 'data' ],
  templateUrl: 'paragraph-markdown.component.html',
  styleUrls: ['../paragraph/paragraph.component.css', 'paragraph-markdown.component.css']
})

export class ParagraphMarkdownComponent extends ParagraphAbstract implements OnInit {

  @Input()
  data: Paragraph;

  html: string = "";

  constructor() {
    super();

  }

  ngOnInit() {
    var contents = [];

    if (this.data && this.data.content) {
      for (let c of this.data.content) {
        contents.push(c);
      }
    }

    for (var c of contents) {
      this.html += this.marktownToHTML(c);
    }

  }

}
