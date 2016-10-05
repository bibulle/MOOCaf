import {Component, Input, EventEmitter, Output} from "@angular/core";
import {Router} from "@angular/router";
import {Logger} from "angular2-logger/core";
import {Course} from "../../models/course";

@Component({
  moduleId: module.id,
  selector: 'class-schedule',
  templateUrl: 'class-schedule.html',
  styleUrls: ['class-schedule.css']
})

export class ClassScheduleComponent {

  @Input()
  course: Course;

  @Output()
  notifySelectedPart: EventEmitter<number[]> = new EventEmitter<number[]>();

  selectedPart = "0";
  openedPart = "";

  constructor(public router: Router,
              private _logger: Logger) {

  }

  ngOnInit() {
      this.notifySelectedPart.emit([0]);
  }

  selectPart(event, level1, level2) {
    event.stopPropagation();

    this.selectedPart = level1 + (level2 != null ? "."+level2 : "");
    if (level2 != null) {
      this.notifySelectedPart.emit([level1, level2]);
    } else {
      this.notifySelectedPart.emit([level1]);
    }

    // Open it (but do not close it)
    if (!this.isOpened(level1, level2)) {
      this.openPart(event, level1, level2);
    }

  }

  openPart(event, level1, level2) {
    event.stopPropagation();

    if (this.isOpened(level1, level2)) {
      this.openedPart = "";
    } else {
      this.openedPart = level1 + (level2 != null ? "."+level2 : "");
    }
  }

  isOpened(level1,level2) {
    return (this.openedPart.startsWith(level1 + (level2 != null ? "."+level2 : "")));
  }
  isSelected(level1,level2) {
    return (this.selectedPart == level1 + (level2 != null ? "."+level2 : ""));
  }
}
