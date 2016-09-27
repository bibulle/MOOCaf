
import {Paragraph} from "./paragraph";
export class Formation {

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

  parts: FormationPart[];

}

export class FormationPart {

  title: string;

  parts: FormationPart[];

  contents: Paragraph[];

}


