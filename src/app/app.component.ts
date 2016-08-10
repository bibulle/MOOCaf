import { Component } from '@angular/core';

import { ParagraphMarkdownComponent } from './paragraph-markdown/paragraph-markdown.component'

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ParagraphMarkdownComponent]
})
export class AppComponent {
  title = 'app works!';
  markdown1 = `This is some markdown text
  Or it should be...
  Is it ?`;
}
