import {Component} from "@angular/core";
import {Logger} from "angular2-logger/core";
import {FormationService} from "../../services/formation.service";
import {NotificationsService} from "angular2-notifications";

@Component({
  moduleId: module.id,
  selector: 'classe',
  templateUrl: 'class.html',
  styleUrls: ['classe.css']
})

export class ClasseComponent {

  constructor(
    private _logger: Logger,
    private _formationService: FormationService,
    private _notificationService: NotificationsService) {
  }

  ngOnInit() {
  }

}