import { Injectable } from '@angular/core';

@Injectable()
export class InMemoryDataService {

  constructor() { }

  createDb() {
    let paragraphs = [
      {content:'This is some markdown text\nOr it should be...\n\nIs it ?'},
      {content:'+	this is a list item\nindented with tabs\n\n'+
        '+   this is a list item\n'+
      'indented with spaces\n\n'+
      'Code:\n\n	this code block is indented by one tab\n\n'+
      'And: \n\n		this code block is indented by two tabs\n\n'+
      'And: \n\n	+	this is an example list item\n		indented with tabs\n\n'+
      '	+   this is an example list item\n	    indented with spaces'},
      {content:'\`\`\`javascript\n  var s = "JavaScript syntax highlighting";\n  alert(s);\n\`\`\`\n\n'+
      '\`\`\`python\n  s = "Python syntax highlighting"\n  print s\n\`\`\`\n\n'+
      '\`\`\`\n  No language indicated, so no syntax highlighting.\n  But let\'s throw in a <b>tag</b>.\n\`\`\`\n\n'},
    ];

    return {paragraphs};
  }

}
