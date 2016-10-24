import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ScrollDirective} from "./scroll.directive";
import {VisibleDirective} from "./visible.directive";
import {ScrollService} from "./scroll.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ScrollDirective,
    VisibleDirective,
  ],
  exports: [
    ScrollDirective,
    VisibleDirective
  ],
  providers: [
    ScrollService
  ]
})
export class ScrollDetectorModule { }
