import {Component} from "@angular/core";
import {Logger} from "angular2-logger/core";
import {FormationService} from "../../services/formation.service";
import {NotificationsService} from "angular2-notifications";
import {Formation, FormationPart} from "../../models/formation";
import {Router, ActivatedRoute, Params} from "@angular/router";

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
                    contents: null
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

    if ((selectedNums.length > 1) && (selectedNums[1] != null)) {
      selectedPart = selectedPart.parts[selectedNums[1]];
    }

    this.selectedPart = selectedPart;
  }

}
