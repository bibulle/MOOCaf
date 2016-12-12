import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MdIconModule, MdInputModule } from "@angular/material";

import { UserComponent } from "./user.component";
import { UserService } from "./user.service";
import { ProfileButtonModule } from "./profile-button/profile-button.module";
import { UserCardModule } from "./user-card/user-card.component";

@NgModule({
  imports: [
    CommonModule,
    MdIconModule,
    MdInputModule,
    FormsModule,
    ProfileButtonModule,
    UserCardModule
  ],
  declarations: [
    UserComponent
  ],
  providers: [
    UserService
  ],
  exports: [
    ProfileButtonModule,
    UserComponent
  ]
})
export class UserModule { }
