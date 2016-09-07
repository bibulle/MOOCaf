import { Component, OnInit , Input} from '@angular/core';

import {Paragraph} from "../models/paragraph";
import {ParagraphType} from "../models/paragraph-type.enum";
import {ParagraphMarkdownComponent} from "../paragraph-markdown/paragraph-markdown.component";
import {ParagraphFormComponent} from "../paragraph-form/paragraph-form.component";

@Component({
  moduleId: module.id,
  selector: 'app-paragraph',
  templateUrl: 'paragraph.component.html',
  styleUrls: ['paragraph.component.css']
})
export class ParagraphComponent implements OnInit {

  @Input()
  src: string;

  @Input()
  data: Paragraph;

  @Input()
  rawContent: string;

  isMarkDown:boolean = false;
  isForm:boolean = false;

  constructor() {
  }

  ngOnInit() {

    if (this.rawContent) {
      this.data = new Paragraph({
        type: ParagraphType.MarkDown,
        content: [this.rawContent]
      })
    }

    if (this.data) {
      this.data = this.data as Paragraph;
      //console.log(this.data);

      this.isMarkDown = (this.data.type == ParagraphType.MarkDown);
      this.isForm = (this.data.type == ParagraphType.Form);
    }
  }

}
