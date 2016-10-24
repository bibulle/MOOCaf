import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwardsComponent } from './awards.component';
import { MdIconModule } from "@angular2-material/icon";
import { AwardCardModule } from "./award-card/award-card.module";
import { AwardService } from "./award.service";
import { FlexModule } from "../widget/flex/flex.module";

@NgModule({
  imports: [
    CommonModule,
    MdIconModule,
    AwardCardModule,
    FlexModule
  ],
  providers: [
    AwardService
  ],
  declarations: [
    AwardsComponent
  ],
  exports: [
    AwardsComponent
  ]
})
export class AwardsModule { }
