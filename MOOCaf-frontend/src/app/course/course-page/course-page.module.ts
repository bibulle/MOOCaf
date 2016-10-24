import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { MdSidenavModule } from "@angular2-material/sidenav";
import { MdIconModule } from "@angular2-material/icon";

import { FlexModule } from "../../widget/flex/flex.module";
import { ScrollDetectorModule } from "../../widget/scroll-detector/scroll-detector.module";

import { CoursePageComponent } from './course-page.component';
import { ScheduleModule } from "./schedule/schedule.module";
import { ParagraphModule } from "../../paragraph/paragraph.module";

@NgModule({
  imports: [
    CommonModule,
    MdIconModule,
    MdSidenavModule,
    FormsModule,
    FlexModule,
    ScrollDetectorModule,
    ScheduleModule,
    ParagraphModule
  ],
  declarations: [CoursePageComponent],
  exports: [CoursePageComponent]
})
export class CoursePageModule { }
