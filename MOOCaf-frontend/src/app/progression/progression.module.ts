import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressionComponent } from './progression.component';
import { ProgressionCardModule } from "./progression-card/progression-card.module";
import { ScrollDetectorModule } from "../widget/scroll-detector/scroll-detector.module";
import { FlexModule } from "../widget/flex/flex.module";

@NgModule({
  imports: [
    CommonModule,
    FlexModule,
    ScrollDetectorModule,
    ProgressionCardModule
  ],
  declarations: [ProgressionComponent]
})
export class ProgressionModule { }
