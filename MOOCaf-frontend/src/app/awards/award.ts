export class Award {


  id: string;
  name: string;
  description: string;
  level: number;
  imgPath: string;
  secret: boolean;
  limitCount: number;

  userCount: number;

  constructor(options) {


    // Init attributes
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.level = options.level;
    this.imgPath = options.imgPath;
    this.secret = options.secret;
    this.limitCount = options.limitCount;
    this.userCount = options.userCount;

  }



}
