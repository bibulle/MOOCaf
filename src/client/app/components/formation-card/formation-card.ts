import {Component, Input} from "@angular/core";
import {Logger} from "angular2-logger/core";
import {Formation} from "../../models/formation";

@Component({
  moduleId: module.id,
  selector: 'formation-card',
  templateUrl: 'formation-card.html',
  styleUrls: ['formation-card.css']
})
export class FormationCardComponent {

  @Input()
  formation: Formation;

  constructor(private _logger: Logger) {
  }

  ngOnInit() {
  }

}
