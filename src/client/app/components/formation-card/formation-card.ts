import {Component, Input} from "@angular/core";
//import {Logger} from "angular2-logger/core";
import {Formation} from "../../models/formation";
import {FormationService} from "../../services/formation.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../services/notification.service";

@Component({
  moduleId: module.id,
  selector: 'formation-card',
  templateUrl: 'formation-card.html',
  styleUrls: ['formation-card.css']
})
export class FormationCardComponent {

  @Input()
  formation: Formation;

  constructor(public router: Router,
              //private _logger: Logger,
              private _formationService: FormationService,
              private _notificationService: NotificationService) {
  }

  ngOnInit() {
  }

  toggleFavorite(event) {
    event.stopPropagation();
    //this._logger.debug("toogleFavorite()");

    this.formation.isFavorite = !this.formation.isFavorite;

    this._formationService.saveUserValues(this.formation)
      .then(formation => {
        //console.log(formation);
        this._notificationService.message("Your changes have been saved");
        this.formation = formation;
      })
      .catch(err => {

        this._notificationService.error("Error saving your choice", err.status+" : "+err.message);
      });

  }

  launchClass(event) {
    event.stopPropagation();
    this.router.navigate(['/classes', this.formation.id]);
  }

}
