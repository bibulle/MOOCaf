import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressionCardComponent } from './progression-card.component';
import { CourseCardModule } from "../../course/course-card/course-card.module";
import { MdCardModule } from "@angular/material";
// import { FlexModule } from "../../widget/flex/flex.module";
import { ScrollDetectorModule } from "../../widget/scroll-detector/scroll-detector.module";

@NgModule({
  imports: [
    CommonModule,
    MdCardModule,
    // FlexModule,
    ScrollDetectorModule,
    CourseCardModule
  ],
  declarations: [ProgressionCardComponent],
  exports: [ProgressionCardComponent]
})
export class ProgressionCardModule { }
