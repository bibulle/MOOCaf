import { Component } from '@angular/core';
import { Logger } from 'angular2-logger/core';
import {NotificationsService} from "angular2-notifications";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  constructor(private _logger: Logger,
              private _service: NotificationsService) {
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
  }


}

