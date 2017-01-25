import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MdSidenavModule, MdIconModule } from "@angular/material";
import { ScrollDetectorModule } from "../../widget/scroll-detector/scroll-detector.module";
import { CoursePageComponent } from "./course-page.component";
import { ScheduleModule } from "./schedule/schedule.module";
import { ParagraphModule } from "../../paragraph/paragraph.module";
import { FileManagerModule } from "./file-manager/file-manager.component";

@NgModule({
  imports: [
    CommonModule,
    MdIconModule,
    MdSidenavModule,
    FormsModule,
    ScrollDetectorModule,
    ScheduleModule,
    ParagraphModule,
    FileManagerModule,
  ],
  declarations: [
    CoursePageComponent
  ],
  entryComponents: [
  ],
  exports: [
    CoursePageComponent
  ]
})
export class CoursePageModule {
}
