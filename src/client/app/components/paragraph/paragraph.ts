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
  courseId: string;

  @Input()
  selectedPartNums: number[];

  @Input()
  paragraphNum: number;

  paragraphNums: number[];


  @Input()
  data: Paragraph;

  isMarkDown:boolean = false;
  isForm:boolean = false;

  constructor() {
  }

  ngOnInit() {

    if (this.data) {
      this.data = this.data as Paragraph;
      //console.log(this.data);

      this.isMarkDown = (this.data.type == ParagraphType.MarkDown);
      this.isForm = (this.data.type == ParagraphType.Form);

      //console.log(this.selectedPartNums+" "+this.paragraphNum+" "+this.data['_id']);
      this.paragraphNums = this.selectedPartNums.slice();
      this.paragraphNums.push(this.paragraphNum);
    }
  }

}
