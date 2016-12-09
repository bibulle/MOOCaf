import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { MdButtonModule } from "@angular/material";
import { MdIconModule } from "@angular/material";
import { MdInputModule } from "@angular/material";

import { CatalogueComponent } from './catalogue.component';
import { CourseModule } from "../course/course.module";
// import { FlexModule } from "../widget/flex/flex.module";
import { ScrollDetectorModule } from "../widget/scroll-detector/scroll-detector.module";

@NgModule({
  imports: [
    CommonModule,
    MdButtonModule,
    MdIconModule,
    MdInputModule,
    FormsModule,
    // FlexModule,
    ScrollDetectorModule,
    CourseModule,
    //CourseCardModule
  ],
  declarations: [CatalogueComponent]
})
export class CatalogueModule { }
