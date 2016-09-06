import {Component} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Router} from "@angular/router";
import {contentHeaders} from "../common/headers";

@Component({
  moduleId: module.id,
  selector: 'signup',
  templateUrl: 'signup.html',
  styleUrls: [ 'signup.css' ]
})
export class SignupComponent {
  constructor(public router: Router, public http: Http) {
  }

  signup(event, username, password, firstname, lastname, email) {
    event.preventDefault();
    let body = JSON.stringify({ username, password, firstname, lastname, email });
    this.http.post('http://localhost:3000/users', body, { headers: contentHeaders })
      .subscribe(
        response => {
          localStorage.setItem('id_token', response.json().id_token);
          this.router.navigate(['/home']);
        },
        error => {
          alert(error.text());
          console.log(error.text());
        }
      );
  }

  login(event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }

}
