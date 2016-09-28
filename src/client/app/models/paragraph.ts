import {ParagraphType} from "./paragraph-type.enum";
import {ParagraphContent} from "./paragraph-content";
import {ParagraphContentType} from "./paragraph-content-type.enum";


export class Paragraph {

  // Paragraph Unique Id
  id: string;

  // The type
  type: ParagraphType;

  // The markdown rawContent
  public content: ParagraphContent[] = new Array<ParagraphContent>();

  // The user previous choice
  userChoice: any;
  answer: any;

  // If the user choice ok(true), ko(false) or undefined
  userCheckOK: boolean;

  // Check done and max
  userCheckCount: number;
  maxCheckCount: number;

  // Used to get access of the enum in the template
  paragraphContentType = ParagraphContentType;

  constructor(options) {


    // Init attributes
    this.id = options.id;
    //this.type = options.type;
    this.userChoice = options.userChoice;
    this.userCheckOK = options.userCheckOK;
    this.userCheckCount = options.userCheckCount;
    this.maxCheckCount = options.maxCheckCount;
    this.answer = options.answer;

    // push contents
    for (let c of options.content) {
     //this.content.push(c);
     if (!this.userChoice && (c.type === ParagraphContentType.Checkbox)) {
       this.userChoice = [];
     } else if (!this.userChoice && (c.type === ParagraphContentType.Text)) {
       this.userChoice = "";
     }
    }

    /*if (this.type == ParagraphType.MarkDown) {
      // Just create Markdown paragraph
      for (let c of options.content) {
        //let p = new ParagraphContentText(c)
        this.content.push(c);
      }
    } else if (this.type == ParagraphType.Form) {
      for (let c of options.content) {
        //let p = new ParagraphContentQuestion(c);
        this.content.push(c);
      }
    }*/

    //console.log(this);

  }



}
