import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {Http, Headers} from "@angular/http";
import {contentHeaders} from "../../common/headers";

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.html',
  styleUrls: [ 'login.css' ]
})
export class LoginComponent {
  constructor(public router: Router, public http: Http) {
  }

  login(event, username, password) {
    console.log(username+" "+password);
    event.preventDefault();
    let body = JSON.stringify({ username, password });
    this.http.post('http://10.70.148.51:4000/users/create', body, { headers: contentHeaders })
      .subscribe(
        response => {
          localStorage.setItem('id_token', response.json().id_token);
          this.router.navigate(['home']);
        },
        error => {
          alert(error.text());
          console.log(error.text());
        }
      );
  }

  signup(event) {
    event.preventDefault();
    this.router.navigate(['/signup']);
  }
}
