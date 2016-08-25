import { Component, OnInit } from '@angular/core';

import {Logger} from "angular2-logger/core";
import {NotificationsService, SimpleNotificationsModule, SimpleNotificationsComponent} from "angular2-notifications";

import {Paragraph} from "./model/paragraph";
import {ParagraphService} from "./services/paragraph.service";
import {ParagraphComponent} from "./paragraph/paragraph.component";
import {ROUTER_DIRECTIVES} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ParagraphComponent, SimpleNotificationsComponent, ROUTER_DIRECTIVES],
  providers: [ParagraphService]
})
export class AppComponent  {

  // notification options
  public options = {
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

}
