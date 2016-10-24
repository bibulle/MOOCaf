import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import {UserService} from "./user.service";
import {ProfileButtonModule} from "./profile-button/profile-button.module";
import { AppRoutingModule } from "../app-routing.module";

@NgModule({
  imports: [
    CommonModule,
    // AppRoutingModule,
    ProfileButtonModule
  ],
  declarations: [
    UserComponent
  ],
  providers: [
    UserService
  ],
  exports: [
    ProfileButtonModule
  ]
})
export class UserModule { }
