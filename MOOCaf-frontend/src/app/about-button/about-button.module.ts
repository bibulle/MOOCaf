import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MdIconModule} from "@angular/material";

import { AboutButtonComponent } from './about-button.component';

@NgModule({
  imports: [
    CommonModule,
    MdIconModule
  ],
  declarations: [
    AboutButtonComponent
  ],
  exports: [
    AboutButtonComponent
  ]
})
export class AboutButtonModule { }
