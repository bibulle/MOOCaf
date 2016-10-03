import IUserChoices = require("./iUserChoices");

class IUserCourse {
  isFavorite: boolean;
  interest: number;
  dateSeen: Date;
  isNew: boolean;
  dateFollowed: Date;
  dateFollowedEnd: Date;
  percentFollowed: number;

  userChoices: { [id: string]: IUserChoices };

  constructor() {
  }
}


export = IUserCourse;
