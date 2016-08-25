import {ParagraphContentType} from "./paragraphContentType";
import {ParagraphType} from "./paragraphType";
import {ParagraphContent} from "./paragraphContent";
import * as _ from 'lodash';


export class Paragraph {

  // Pragraph Unique Id
  id: string;

  // The type
  type: ParagraphType;

  // The markdown rawContent
  public content: ParagraphContent[] = new Array<ParagraphContent>();

  // The user previous choice
  userChoice: any;
  answer: any;

  // If the user choice ok(true), ko(false) or undefined
  userCheckOK: boolean;

  // Check done and max
  userCheckCount: number;
  maxCheckCount: number;

  // Used to get access of the enum in the template
  paragraphContentType = ParagraphContentType;

  constructor(options) {

    _.assign(this, options);

    // Change id type to string
    this.id = String(this.id);

    // if no userChoice, init it
    for (let c of options.content) {
      if (!this.userChoice && (c.type === ParagraphContentType.Checkbox)) {
        this.userChoice = [];
      } else if (!this.userChoice && (c.type === ParagraphContentType.Text)) {
        this.userChoice = "";
      }
    }

  }

  static find() {
    return Paragraph.paragraphs;
  }

  static paragraphs: Paragraph[] = [

    new Paragraph({
        id: 7391287124,
        type: ParagraphType.MarkDown,
        content: [
          '*quelques mots* ou  _quelques mots_\n\n**plus important** ou __également important__',
          'Mon texte `code` fin de mon texte',
          '    Première ligne de code\n    Deuxième ligne',
          '> Ce texte apparaîtra dans un élément HTML blockquote.',
          '* Pommes\n* Poires\n    * Sous élément avec au moins quatre espaces devant.',
          '1. mon premier\n2. mon deuxième',
          '# un titre de premier niveau\n#### un titre de quatrième niveau\n\n',
          'Titre de niveau 1\n=====================\n\nTitre de niveau 2\n--------------------'
        ]
      }
    ),
    new Paragraph({
        id: 16548642,
        type: ParagraphType.MarkDown,
        content: [
          '+	this is a list item\nindented with tabs\n\n' +
          '+   this is a list item\n' +
          'indented with spaces\n\n' +
          'Code:\n\n	this code block is indented by one tab\n\n' +
          'And: \n\n		this code block is indented by two tabs\n\n' +
          'And: \n\n+	this is an example list item\n		indented with tabs\n\n' +
          '+   this is an example list item\n	    indented with spaces'
        ]
      }
    ),
    new Paragraph({
        id: 43425,
        type: ParagraphType.MarkDown,
        content: [
          '\`\`\`javascript\n  var s = "JavaScript syntax highlighting";\n  alert(s);\n\`\`\`',
          '\`\`\`python\n  s = "Python syntax highlighting"\n  print s\n\`\`\`',
          '\`\`\`\n  No language indicated, so no syntax highlighting.\n  But let\'s throw in a <b>tag</b>.\n\`\`\`'
        ]
      }
    ),
    new Paragraph({
        id: 4254542,
        type: ParagraphType.Form,
        content: [
          {
            type: ParagraphContentType.Label,
            label: 'This is the title of the question'
          },
          {
            type: ParagraphContentType.Radio,
            name: 'F239712893F323AB35',
            label: 'Is response **True** ?\n\nSecond line',
            value: '1'
          },
          {
            type: ParagraphContentType.Radio,
            name: 'F239712893F323AB35',
            label: 'Is response **False** ?',
            value: '2'
          },
          {
            type: ParagraphContentType.Radio,
            name: 'F239712893F323AB35',
            label: 'Or **Neither**',
            value: '3'
          },
        ],
        userChoice: undefined,
        userCheckOK: undefined,
        userCheckCount: 0,
        maxCheckCount: 2
      }
    ),
    new Paragraph({
        id: 74242857,
        type: ParagraphType.Form,
        content: [
          {
            type: ParagraphContentType.Label,
            label: 'This is the title of the question'
          },
          {
            type: ParagraphContentType.Checkbox,
            name: 'FC56E98',
            label: 'Is response **True** ?\n\nSecond line',
            value: '1'
          },
          {
            type: ParagraphContentType.Checkbox,
            name: 'FC56E98',
            label: 'Is response **False** ?',
            value: '2'
          },
          {
            type: ParagraphContentType.Checkbox,
            name: 'FC56E98',
            label: 'Or **Neither**',
            value: '3'
          },
        ],
        userChoice: undefined,
        userCheckOK: undefined,
        userCheckCount: 0,
        maxCheckCount: 3
      }
    ),
    new Paragraph({
        id: 453435,
        type: ParagraphType.Form,
        content: [
          {
            type: ParagraphContentType.Label,
            label: 'This is the title of the question'
          },
          {
            type: ParagraphContentType.Text,
            name: 'fec4637',
            label: 'What do you think ?\n\nSecond line',
            size: 20
          },
        ],
        userChoice: undefined,
        userCheckOK: undefined,
        userCheckCount: 0,
        maxCheckCount: 3
      }
    ),
    new Paragraph({
        id: 43534563,
        type: ParagraphType.Form,
        content: [
          {
            type: ParagraphContentType.Label,
            label: 'This is the title of the question'
          },
          {
            type: ParagraphContentType.Radio,
            name: 'F239712893F323AB35',
            label: 'Is response **True** ?\n\nSecond line',
            value: '1'
          },
          {
            type: ParagraphContentType.Radio,
            name: 'F239712893F323AB35',
            label: 'Is response **False** ?',
            value: '2'
          },
          {
            type: ParagraphContentType.Radio,
            name: 'F239712893F323AB35',
            label: 'Or **Neither**',
            value: '3'
          },
        ],
        userChoice: 2,
        userCheckOK: false,
        userCheckCount: 2,
        maxCheckCount: 2,
        answer: 1
      }
    ),
    new Paragraph({
        id: 86453453,
        type: ParagraphType.Form,
        content: [
          {
            type: ParagraphContentType.Label,
            label: 'This is the title of the question'
          },
          {
            type: ParagraphContentType.Checkbox,
            name: 'FC56E98',
            label: 'Is response **True** ?\n\nSecond line',
            value: '1'
          },
          {
            type: ParagraphContentType.Checkbox,
            name: 'FC56E98',
            label: 'Is response **False** ?',
            value: '2'
          },
          {
            type: ParagraphContentType.Checkbox,
            name: 'FC56E98',
            label: 'Or **Neither**',
            value: '3'
          },
        ],
        userChoice: ['1', '2'],
        userCheckOK: false,
        userCheckCount: 3,
        maxCheckCount: 3,
        answer: ['1', '3']
      }
    ),
    new Paragraph({
        id: 475381,
        type: ParagraphType.Form,
        content: [
          {
            type: ParagraphContentType.Label,
            label: 'This is the title of the question'
          },
          {
            type: ParagraphContentType.Text,
            name: 'fec4637',
            label: 'What do you think ?\n\nSecond line',
            size: 20
          },
        ],
        userChoice: 'rgeg',
        userCheckOK: false,
        userCheckCount: 3,
        maxCheckCount: 3,
        answer: 'sdkfsd sdg'
      }
    ),
    new Paragraph({
        id: 475381,
        type: ParagraphType.Form,
        content: [
          {
            type: ParagraphContentType.Label,
            label: 'This is the title of the question'
          },
          {
            type: ParagraphContentType.Text,
            name: 'fec4637',
            label: 'What do you think ?',
            size: 20
          },
        ],
        userChoice: 'rgeg',
        userCheckOK: false,
        userCheckCount: 3,
        maxCheckCount: 3,
        answer: 'sdkfsd sdg'
      }
    ),
  ];
}


