import {ParagraphContent} from "./paragraph-content";
export class ParagraphContentText extends ParagraphContent {

  type: string = "ParagraphContentText";

  content: string;

  constructor(s: string) {
    super();
    this.content = s;
  }
}
