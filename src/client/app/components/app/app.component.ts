import { Component } from '@angular/core';
import { Logger } from 'angular2-logger/core';
import {NotificationsService} from "angular2-notifications";
import {FormationService} from "../../services/formation.service";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {

  countCurrentFormations = 0;

  constructor(private _logger: Logger,
              private _formationService: FormationService) {
  }

  // notification options
  public notificationsOptions = {
    timeOut: 5000,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    showProgressBar: true,
    pauseOnHover: true,
    preventDuplicates: false,
    preventLastDuplicates: "visible",
    rtl: false,
    animate: "scale",
    position: ["right", "bottom"]
  };

  ngOnInit() {
    // Has the user some "current formation"
    this._formationService.currentFormationObservable().subscribe(
      count => {
        this.countCurrentFormations = count;
      }
    );
  }


}

