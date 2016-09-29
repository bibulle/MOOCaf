import IUserChoices = require("./iUserChoices");

class IUserFormation {
  isFavorite: boolean;
  interest: number;
  dateFollowed: Date;
  dateFollowedEnd: Date;
  percentFollowed: number;

  userChoices: { [id: string]: IUserChoices };

  constructor() {
  }
}


export = IUserFormation;
