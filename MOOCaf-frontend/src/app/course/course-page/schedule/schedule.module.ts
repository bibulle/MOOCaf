import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdIconModule } from "@angular2-material/icon";

import { FlexModule } from "../../../widget/flex/flex.module";

import { ScheduleComponent } from './schedule.component';

@NgModule({
  imports: [
    CommonModule,
    MdIconModule,
    FlexModule,
  ],
  declarations: [ScheduleComponent],
  exports: [ScheduleComponent]
})
export class ScheduleModule { }
