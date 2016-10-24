import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParagraphComponent } from './paragraph.component';
import { MdIconModule } from "@angular2-material/icon";
import { ParagraphMarkdownComponent } from './paragraph-markdown/paragraph-markdown.component';
import { ParagraphFormComponent } from './paragraph-form/paragraph-form.component';
import { FormsModule } from "@angular/forms";
import { FlexModule } from "../widget/flex/flex.module";
import { ScrollDetectorModule } from "../widget/scroll-detector/scroll-detector.module";
import { MdButtonModule } from "@angular2-material/button";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdIconModule,
    MdButtonModule,
    FlexModule,
    ScrollDetectorModule
  ],
  declarations: [ParagraphComponent, ParagraphMarkdownComponent, ParagraphFormComponent],
  exports: [ParagraphComponent]
})
export class ParagraphModule { }
