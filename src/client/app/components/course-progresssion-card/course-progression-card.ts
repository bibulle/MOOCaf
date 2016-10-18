import {Component, Input} from "@angular/core";
import {Course} from "../../models/course";

@Component({
  moduleId: module.id,
  selector: 'course-progression-card',
  templateUrl: 'course-progression-card.html',
  styleUrls: ['course-progression-card.css']
})
export class CourseProgressionCardComponent {

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
