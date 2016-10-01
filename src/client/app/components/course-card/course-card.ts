import {Component, Input} from "@angular/core";
//import {Logger} from "angular2-logger/core";
import {Course} from "../../models/course";
import {CourseService} from "../../services/course.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../services/notification.service";

@Component({
  moduleId: module.id,
  selector: 'course-card',
  templateUrl: 'course-card.html',
  styleUrls: ['course-card.css']
})
export class CourseCardComponent {

  @Input()
  course: Course;

  constructor(public router: Router,
              //private _logger: Logger,
              private _courseService: CourseService,
              private _notificationService: NotificationService) {
  }

  ngOnInit() {
  }

  toggleFavorite(event) {
    event.stopPropagation();

    this.course.isFavorite = !this.course.isFavorite;

    this._courseService.saveUserValues(this.course)
      .then(course => {
        //console.log(course);
        this._notificationService.message("Your changes have been saved");
        this.course = course;
      })
      .catch(err => {

        this._notificationService.error("Error saving your choice", err.status+" : "+err.message);
      });

  }

  launchClass(event) {
    event.stopPropagation();
    this.router.navigate(['/classes', this.course.id]);
  }

}
