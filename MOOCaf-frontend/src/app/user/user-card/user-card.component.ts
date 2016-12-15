import { Component, OnInit, Input, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MdButtonModule, MdInputModule, MdIconModule } from "@angular/material";
import { User } from "../user";

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input()
  private user: User;

  @Input()
  edited: boolean = false;

  @Input()
  index: number = 0;

  private userClosed = true;

  private previousUsername = "";

  constructor() { }

  ngOnInit() {
    this.userClosed=(this.index != 0);

    this.user['courseIds'] = Object.keys(this.user['courses']);
    this.user['statIds'] = Object.keys(this.user['stats']);
  }

  /**
   * Validate the username rules
   */
  userNameChanged() {
    // username should be lowercase and replace space with underscore
    if (this.user.username) {
      this.user.username = this.user.username
                               .toLowerCase()
                               .replace(" ","_");
    }

    // Should match the pattern
    if (!this.user.username.match("^[a-z][a-z0-9_-]*$")) {
      this.user.username = this.previousUsername;
    } else {
      this.previousUsername = this.user.username;
    }
  }

  /**
   * Open/close the user card
   */
  toggleUserClosed() {
    this.userClosed = !this.userClosed;
  }


}

@NgModule({
  imports: [
    CommonModule,
    MdButtonModule,
    MdInputModule,
    MdIconModule.forRoot(),
    FormsModule
  ],
  declarations: [UserCardComponent],
  exports: [UserCardComponent],
})
export class UserCardModule { }
