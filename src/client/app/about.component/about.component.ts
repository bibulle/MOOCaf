
import {Component} from "@angular/core";
import {UserService} from "../services/user.service";

@Component({
  moduleId: module.id,
  selector: 'about-button',
  templateUrl: 'about.component.html',
  styleUrls: [ 'about.component.css' ]
})
export class AboutComponent {

  user: {};


  constructor() {
  }
  ngOnInit() {
  }

}
