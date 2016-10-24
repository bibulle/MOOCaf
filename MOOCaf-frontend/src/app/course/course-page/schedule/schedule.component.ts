import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Course } from "../../course";
import { Router } from "@angular/router";

@Component({
  selector: 'class-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  @Input()
  course: Course;

  @Output()
  notifySelectedPart: EventEmitter<number[]> = new EventEmitter<number[]>();

  @Input()
  selectedPartNums;

  openedPart = [];

  constructor(public router: Router) { }

  ngOnInit() {

    this.notifySelectedPart.emit(this.selectedPartNums);

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
