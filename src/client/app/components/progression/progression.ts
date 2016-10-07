import {Component} from "@angular/core";
import {Course} from "../../models/course";
import {Subject} from "rxjs/Subject";
import {Logger} from "angular2-logger/core";
import {CourseService} from "../../services/course.service";
import {NotificationService} from "../../services/notification.service";

@Component({
  moduleId: module.id,
  selector: 'progression',
  templateUrl: 'progression.html',
  styleUrls: ['progression.css']
})

export class ProgressionComponent {

  private courses: Course[];


  constructor(
    private _logger: Logger,
    private _courseService: CourseService,
    private _notificationService: NotificationService) {
  }

  ngOnInit() {

    this._courseService.getCourses()
      .then(courses =>
      {
        this.courses = courses;
      })
      .catch(err => {
        this._notificationService.error("Error", err)
      });

  }
}
