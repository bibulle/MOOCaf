import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileButtonComponent } from './profile-button.component';
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    ProfileButtonComponent
  ],
  exports: [
    ProfileButtonComponent
  ]
})
export class ProfileButtonModule { }
