
import {Paragraph} from "./paragraph";

export class Course {

  // Course stuff
  id: string;
  name: string;
  description: string;
  note: number;
  noteCount: number;
  parts: CoursePart[];

  created: Date;
  update: Date;


  // User stuff
  isFavorite: boolean;
  interest: number;
  dateSeen: Date;
  isNew: boolean;
  dateFollowed: Date;
  dateFollowedEnd: Date;
  percentFollowed: number;




}

export class CoursePart {

  title: string;

  parts: CoursePart[];

  contents: Paragraph[];

  constructor(option) {
    this.title = option.title;
    this.parts = option.parts;
    this.contents = option.contents;
  }
}


