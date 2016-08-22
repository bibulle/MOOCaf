import {ParagraphContent} from "./paragraph-content";

export class ParagraphContentQuestion extends ParagraphContent {

  type: string = "ParagraphContentQuestion";

  content: string;

  constructor(s: string) {
    super();
    this.content = s;
  }
}
