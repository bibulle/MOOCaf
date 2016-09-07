
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
