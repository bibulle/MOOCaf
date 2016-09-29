import {Component} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import {Logger} from "angular2-logger/core";
import {NotificationService} from "../../services/notification.service";

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

  private scheduleClosed = true;

  constructor(private route: ActivatedRoute,
              public router: Router,
              private _logger: Logger,
              private _formationService: FormationService,
              private _notificationService: NotificationService) {

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
            // If no part... add an fake one
            if (formation.parts.length == 0) {
              formation.parts.push(new FormationPart({title: "Not yet defined"}));
            }

            this.formation = formation;
            //console.log(formation);

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


}
