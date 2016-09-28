import UserChoices = require("./iUserChoices");

class UserFormation {
  isFavorite: boolean;
  interest: number;
  dateFollowed: Date;
  dateFollowedEnd: Date;
  percentFollowed: number;

  userChoices: { [id: string]: UserChoices };

  constructor() {

  }
}


export = UserFormation;
