import { Component, OnInit , Input} from '@angular/core';

import {Paragraph} from "../../models/paragraph";
import {ParagraphType} from "../../models/paragraph-type.enum";

@Component({
  moduleId: module.id,
  selector: 'paragraph',
  templateUrl: 'paragraph.html',
  styleUrls: ['paragraph.css']
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



    //console.log(this.data);

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
