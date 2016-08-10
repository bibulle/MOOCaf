import {Component, OnInit, Input} from '@angular/core';

//import Showdown from 'showdown';
//
import marked from 'marked';
//import marked = require('marked');

@Component({
  moduleId: module.id,
  selector: 'app-paragraph-markdown',
  inputs: [ 'src', 'data' ],
  templateUrl: 'paragraph-markdown.component.html',
  styleUrls: ['paragraph-markdown.component.css']
})
export class ParagraphMarkdownComponent implements OnInit {

  @Input()
  src: String;

  @Input()
  data: String;

  constructor() {
  }

  ngOnInit() {
    let content: String = "To be done... innerHTML";
    if (this.src) {
      console.log("Not yet implemented");
    } else if (this.data) {
      content = this.data;
    }

    //content = marked(content);
  }

}
