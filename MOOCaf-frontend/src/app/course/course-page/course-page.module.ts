import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { MdSidenavModule, MdDialogModule, MdTooltipModule, MdProgressBarModule } from "@angular/material";
import { MdIconModule } from "@angular/material";

// import { FlexModule } from "../../widget/flex/flex.module";
import { ScrollDetectorModule } from "../../widget/scroll-detector/scroll-detector.module";

import { CoursePageComponent } from './course-page.component';
import { ScheduleModule } from "./schedule/schedule.module";
import { ParagraphModule } from "../../paragraph/paragraph.module";
import { FileManagerComponent } from './file-manager/file-manager.component';
import { FileUploadModule } from "ng2-file-upload";

@NgModule({
  imports: [
    CommonModule,
    MdIconModule,
    MdSidenavModule,
    MdDialogModule.forRoot(),
    MdTooltipModule,
    MdProgressBarModule,
    FormsModule,
    FileUploadModule,
    ScrollDetectorModule,
    ScheduleModule,
    ParagraphModule
  ],
  declarations: [
    CoursePageComponent,
    FileManagerComponent
  ],
  entryComponents: [
    FileManagerComponent
  ],
  exports: [
    CoursePageComponent
  ]
})
export class CoursePageModule {
}
