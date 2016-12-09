import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MdCardModule } from "@angular/material";
import { MdIconModule } from "@angular/material";
import { MdInputModule } from "@angular/material";

import { CourseCardComponent } from "./course-card.component";
// import { FlexModule } from "../../widget/flex/flex.module";
import { ScrollDetectorModule } from "../../widget/scroll-detector/scroll-detector.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdCardModule,
    MdIconModule,
    MdInputModule,
    // FlexModule,
    ScrollDetectorModule,
  ],
  declarations: [
    CourseCardComponent
  ],
  exports: [
    CourseCardComponent
  ]
})
export class CourseCardModule { }
