import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwardCardComponent } from './award-card.component';
import { MdIconModule } from "@angular/material";
import { FormsModule } from "@angular/forms";
// import { FlexModule } from "../../widget/flex/flex.module";

@NgModule({
  imports: [
    CommonModule,
    MdIconModule,
    FormsModule,
    // FlexModule
  ],
  declarations: [AwardCardComponent],
  exports: [AwardCardComponent]
})
export class AwardCardModule { }
