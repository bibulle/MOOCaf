import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

import { MdButtonModule } from "@angular2-material/button";
import { MdCardModule } from "@angular2-material/card";
import { MdInputModule } from "@angular2-material/input";

import { LoginComponent } from './login.component';
import { FlexModule } from "../widget/flex/flex.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MdButtonModule,
    MdCardModule,
    MdInputModule,
    FlexModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule { }
