
import {Paragraph} from "./paragraph";

export class Course {

  id: string;
  name: string;
  description: string;
  note: number;
  noteCount: number;
  isFavorite: boolean;
  interest: number;
  dateFollowed: Date;
  dateFollowedEnd: Date;
  percentFollowed: number;
  created: Date;
  update: Date;

  parts: CoursePart[];

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


