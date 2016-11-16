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
import { ParagraphTelnetComponent } from './paragraph-telnet/paragraph-telnet.component';
import { MdProgressBarModule } from "@angular2-material/progress-bar";
import { MdProgressCircleModule } from "@angular2-material/progress-circle";
import { JobService } from "./job.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdIconModule,
    MdButtonModule,
    MdProgressBarModule,
    MdProgressCircleModule,
    FlexModule,
    ScrollDetectorModule
  ],
  declarations: [ParagraphComponent, ParagraphMarkdownComponent, ParagraphFormComponent, ParagraphTelnetComponent],
  providers: [
    JobService
  ],
  exports: [ParagraphComponent]
})
export class ParagraphModule { }
