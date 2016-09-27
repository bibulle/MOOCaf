import {Component} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import {Logger} from "angular2-logger/core";
import {NotificationsService} from "angular2-notifications";

import {FormationService} from "../../services/formation.service";
import {Formation, FormationPart} from "../../models/formation";
import {ParagraphType} from "../../models/paragraph-type.enum";
import {Paragraph} from "../../models/paragraph";
import {ParagraphContentType} from "../../models/paragraph-content-type.enum";

@Component({
  moduleId: module.id,
  selector: 'class',
  templateUrl: 'class.html',
  styleUrls: ['class.css']
})

export class ClassComponent {

  private currentFormationCount = 0;
  private formations: Formation[];

  private formation: Formation;
  private selectedPart: FormationPart;
  private selectedPartLevel: number;

  //private scheduleClosed = false;

  constructor(private route: ActivatedRoute,
              public router: Router,
              private _logger: Logger,
              private _formationService: FormationService,
              private _notificationService: NotificationsService) {

    /// Get current formation count
    this._formationService.currentFormationObservable().subscribe(
      count => {
        this.currentFormationCount = count;
      }
    );

  }

  ngOnInit() {

    this.formation = null;
    this.formations = null;

    this.route.params.forEach((params: Params) => {
      let id = params['id'];

      if (id == null) {
        // -----------------------------------------------
        // id is undefined, it's general class page asked
        // -----------------------------------------------
        this._formationService.getFormations(true)
          .then(formations =>
          {
            this.formations = formations
              .sort((f1, f2) => {
                if (f1.dateFollowed && f2.dateFollowed) {
                  return f2.dateFollowed.getTime() - f1.dateFollowed.getTime();
                } else {
                  return 0;
                }
              });
            if (this.formations.length == 0) {
              this.router.navigate(['/catalogue']);
            } else if (this.formations.length == 1) {
              this.router.navigate(['/classes', this.formations[0].id]);
            }
          })
          .catch(err => {
            this._notificationService.error("Error", err)
          });

      } else {
        // ---------------------------------
        // id is defined, only one formation
        // ---------------------------------
        this._formationService.getFormation(id)
          .then(formation =>
          {
            // TODO : Will be in services and database... for now, hard coded
            formation.parts = [
              {
                title: "Week 1 : Big Data, how it works ?",
                parts: [
                  {
                    title: "What is Big Data ? (from business point of view)",
                    parts: null,
                    contents: [

                      new Paragraph({
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
                          type: ParagraphType.MarkDown,
                          content: [
                            '\`\`\`javascript\n  var s = "JavaScript syntax highlighting";\n  alert(s);\n\`\`\`',
                            '\`\`\`python\n  s = "Python syntax highlighting"\n  print s\n\`\`\`',
                            '\`\`\`\n  No language indicated, so no syntax highlighting.\n  But let\'s throw in a <b>tag</b>.\n\`\`\`'
                          ]
                        }
                      ),
                      new Paragraph({
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
                    ]
                  },
                  {
                    title: "What is Big Data ? (from developer point of view)",
                    parts: [],
                    contents: null
                  },

                ],
                contents: null
              },
              {
                title: "Week 2 : Let's try something",
                parts: [
                  {
                    title: "Prerequisite : A little bit of unix",
                    parts: null,
                    contents: null
                  },
                  {
                    title: "Let's code",
                    parts: null,
                    contents: null
                  },
                ],
                contents: null
              },
              {
                title: "Week 3 : A little bit deeper",
                parts: null,
                contents: null
              },
            ];

            // TODO : END


            this.formation = formation;

          })
          .catch(err => {
            this._logger.error(err);
            this._notificationService.error("Error", err)
          });
      }






    });




  }


  /**
   * The selected part change
   */
  onNotifySelectedPart(selectedNums) {

    var selectedPart = this.formation.parts[selectedNums[0]];
    var selectedPartLevel = 1;

    if ((selectedNums.length > 1) && (selectedNums[1] != null)) {
      selectedPart = selectedPart.parts[selectedNums[1]];
      selectedPartLevel = 2;

    }

    this.selectedPart = selectedPart;
    this.selectedPartLevel = selectedPartLevel;
  }

  // TODO : toggle the schedule to get more space ?
  /**
   * The schedule must be shown (or not)
   */
  //toggleSchedule() {
  //  this.scheduleClosed = !this.scheduleClosed;
  //}

}
