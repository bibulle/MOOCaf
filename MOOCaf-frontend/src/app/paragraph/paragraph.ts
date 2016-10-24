

import {ParagraphType} from "./paragraph-type.enum";
import {ParagraphContentType} from "./paragraph-content-type.enum";
import {ParagraphContent} from "./paragraph-content";


export class Paragraph {

  // Paragraph Unique Id
  id: string;

  // The type
  type: ParagraphType;

  // The markdown rawContent
  public content: any[] = new Array<ParagraphContent>();

  // Answer needed
  answer: any;
  // How many try allowed
  maxCheckCount: number;

  // Is this paragraph considered as "done" for this user
  userDone: Date;

  // The user previous choice
  userChoice: any;

  // If the user choice ok(true), ko(false) or undefined
  userCheckOK: boolean;

  // Check done and max
  userCheckCount: number;

  // Used to get access of the enum in the template
  paragraphContentType = ParagraphContentType;

  constructor(options) {

    this.type = options.type;
    this.content = options.content;

    // Init attributes
    this.id = options.id;
    this.userChoice = options.userChoice;
    this.userCheckOK = options.userCheckOK;
    this.userCheckCount = options.userCheckCount;
    this.maxCheckCount = options.maxCheckCount;
    this.answer = options.answer;


  }



}
