import { Component, OnInit, Input } from '@angular/core';
import { Course } from "../../course/course";

@Component({
  selector: 'course-progression-card',
  templateUrl: './progression-card.component.html',
  styleUrls: ['./progression-card.component.css']
})
export class ProgressionCardComponent implements OnInit {

  @Input()
  course: Course;

  constructor() {
  }

  ngOnInit() {
    if (this.course.new == null) {
      this.course.new = true;
    }
  }

}
