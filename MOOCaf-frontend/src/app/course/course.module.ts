import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {CourseService} from "./course.service";

import { CourseCardModule } from "./course-card/course-card.module";
import { CourseCardComponent } from "./course-card/course-card.component";

import { CoursePageModule } from "./course-page/course-page.module";
import { CoursePageComponent } from "./course-page/course-page.component";

@NgModule({
  imports: [
    CommonModule,
    CourseCardModule,
    CoursePageModule,
  ],
  providers: [
    CourseService
  ],
  exports: [
    CourseCardComponent,
    CoursePageComponent
  ]
})
export class CourseModule { }
