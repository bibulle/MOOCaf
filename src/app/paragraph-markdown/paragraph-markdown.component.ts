import {Component, OnInit, Input} from '@angular/core';
import {Paragraph} from "../paragraph";

import * as marked from 'marked';
import * as highlight from 'highlight.js';

@Component({
  moduleId: module.id,
  selector: 'app-paragraph-markdown',
  inputs: [ 'src', 'data' ],
  templateUrl: 'paragraph-markdown.component.html',
  styleUrls: ['paragraph-markdown.component.css', '/vendor/highlightjs/styles/default.css']
})
export class ParagraphMarkdownComponent implements OnInit {

  @Input()
  src: string;

  @Input()
  data: Paragraph;

  @Input()
  content: string;

  html: string;
  element;

  constructor() {
    // Synchronous highlighting with highlight.js
    marked.setOptions({
    highlight: function (code) {
        return highlight.highlightAuto(code).value;
      }
    });

  }

  ngOnInit() {
    var content = "";
    if (this.content) {
      content = this.content;
    } else if (this.src) {
      console.log("Not yet implemented");
    } else if (this.data) {
      content = this.data.content;
    }

    this.html = marked(content);

    //console.log(content);
  }

}
