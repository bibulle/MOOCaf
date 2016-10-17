import {Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges} from "@angular/core";
import {Router} from "@angular/router";
//import {Logger} from "angular2-logger/core";
import {Course} from "../../models/course";

@Component({
  moduleId: module.id,
  selector: 'class-schedule',
  templateUrl: 'class-schedule.html',
  styleUrls: ['class-schedule.css']
})

export class ClassScheduleComponent implements OnInit, OnChanges {
  @Input()
  course: Course;

  @Output()
  notifySelectedPart: EventEmitter<number[]> = new EventEmitter<number[]>();

  @Input()
  selectedPartNums;
  openedPart = [];

  constructor(public router: Router,
              //private _logger: Logger
  ) {

  }

  ngOnInit() {

    this.notifySelectedPart.emit(this.selectedPartNums);
    //this._logger.debug(this.course)
  }

  //noinspection JSUnusedGlobalSymbols
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPartNums']) {
      let change = changes['selectedPartNums'];
      if ((change.previousValue.toString() !== change.currentValue.toString()) && !this.isOpened(change.currentValue)) {
        this.openPart(null, change.currentValue);
      }
    }
  }

  selectPart(event, levels: number[]) {
    event.stopPropagation();

    this.selectedPartNums = levels;
    this.notifySelectedPart.emit(this.selectedPartNums);

    // Open it (but do not close it)
    if (!this.isOpened(this.selectedPartNums)) {
      this.openPart(event, this.selectedPartNums);
    }

  }

  openPart(event, levels: number[]) {
    if (event) {
      event.stopPropagation();
    }

    if (this.isOpened(levels)) {
      this.openedPart = [];
    } else {
      this.openedPart = levels;
    }
  }

  isOpened(levels: number[]) {
    return (this.openedPart.toString().startsWith(levels.toString().toString()));
  }

  isSelected(levels: number[]) {
    return (this.selectedPartNums.toString() == levels.toString());
  }

}
