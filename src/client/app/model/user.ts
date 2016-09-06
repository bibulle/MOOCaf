import {ParagraphType} from "./paragraph-type.enum";
import {ParagraphContent} from "./paragraph-content";
import {ParagraphContentText} from "./paragraph-content-text";
import {ParagraphContentQuestion} from "./paragraph-content-question";
import {ParagraphContentType} from "./paragraph-content-type.enum";


export class User {


  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;

  constructor(options) {


    // Init attributes
    this.id = options.id;
    this.username = options.username;
    this.firstname = options.firstname;
    this.lastname = options.lastname;
    this.email = options.email;

  }



}
