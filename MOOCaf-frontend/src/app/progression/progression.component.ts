import { Component, OnInit } from '@angular/core';
import { NotificationService } from "../widget/notification/notification.service";
import { CourseService } from "../course/course.service";
import { Logger } from "angular2-logger/core";
import { Course } from "../course/course";

@Component({
  selector: 'progression',
  templateUrl: './progression.component.html',
  styleUrls: ['./progression.component.css']
})
export class ProgressionComponent implements OnInit {

  private courses: Course[];


  constructor(
    private _logger: Logger,
    private _courseService: CourseService,
    private _notificationService: NotificationService) {
  }

  ngOnInit() {

    this._courseService.getCourses(false, true)
        .then(courses =>
        {
          this.courses = courses;
        })
        .catch(err => {
          this._notificationService.error("Error", err)
        });

  }
}
