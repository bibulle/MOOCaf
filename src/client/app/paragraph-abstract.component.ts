import * as marked from 'marked';
import * as highlight from 'highlight.js';


export abstract class ParagraphAbstract {


  constructor() {
    // Synchronous highlighting with highlight.js
    marked.setOptions({
      highlight: function (code) {
        return highlight.highlightAuto(code).value;
      }
    });
  }


  marktownToHTML(markdown: any) {

    if (typeof markdown === "string") {
      return marked(markdown);
    } else if ( markdown.type === "ParagraphContentText") {
      return marked(markdown.content);
    }

  }


}
