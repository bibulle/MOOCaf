import {Component, OnInit, Input} from '@angular/core';
import {Paragraph} from "../../models/paragraph";

import {ParagraphAbstract} from "../paragraph/paragraph-abstract";

@Component({
  moduleId: module.id,
  selector: 'paragraph-markdown',
  //inputs: [ 'data' ],
  templateUrl: 'paragraph-markdown.html',
  styleUrls: ['../paragraph/paragraph.css', 'paragraph-markdown.css']
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
      this.html += ParagraphAbstract.markdownToHTML(c);
    }

  }

}
