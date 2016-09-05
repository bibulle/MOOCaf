import {Component} from "@angular/core";
import {SimpleNotificationsComponent} from "angular2-notifications";
import {ParagraphService} from "./services/paragraph.service";
import {ParagraphComponent} from "./paragraph/paragraph.component";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {FlexDirective} from "./directives/flex-directive";
import {LayoutDirective} from "./directives/layout-directive";
import {LayoutAlignDirective} from "./directives/layout-align-directive";
import {ProfileComponent} from "./profile.component/profile.component";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ProfileComponent, ParagraphComponent, SimpleNotificationsComponent, ROUTER_DIRECTIVES, FlexDirective, LayoutDirective, LayoutAlignDirective],
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
