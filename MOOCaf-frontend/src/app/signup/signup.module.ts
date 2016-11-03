import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { MdCardModule } from "@angular2-material/card";
import { MdInputModule } from "@angular2-material/input";
import { MdButtonModule } from "@angular2-material/button";

import { SignupComponent } from './signup.component';
import { FlexModule } from "../widget/flex/flex.module";

@NgModule({
  imports: [
    CommonModule,
    MdButtonModule,
    MdCardModule,
    MdInputModule,
    FlexModule,
    FormsModule
  ],
  declarations: [SignupComponent],
  exports: [SignupComponent],
})
export class SignupModule { }
