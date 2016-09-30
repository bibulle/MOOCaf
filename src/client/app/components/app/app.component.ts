import {Component, HostListener} from '@angular/core';
import { Logger } from 'angular2-logger/core';
import {FormationService} from "../../services/formation.service";
import {NotificationService} from "../../services/notification.service";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {

  countCurrentFormations = 0;

  notificationMessage = "";
  showMessage = false;
  notificationTimeout = null;

  constructor(private _logger: Logger,
              private _formationService: FormationService,
              private _notificationService: NotificationService) {
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
    this._notificationService.getMessageEmmiter()
      .subscribe(message => {
        this.notificationMessage = message;
        this.showMessage = true;

        if (this.notificationTimeout != null) {
          clearTimeout(this.notificationTimeout);
        }

        this.notificationTimeout = setTimeout(() => {
          this.showMessage = false;
        },
        2000);
      })

  }


}

