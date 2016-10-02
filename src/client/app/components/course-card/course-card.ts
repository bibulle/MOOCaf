import {Component, Input} from "@angular/core";
import {Course} from "../../models/course";
import {CourseService} from "../../services/course.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../services/notification.service";
import {VisibilityEvent} from "../../directives/visible-directive";
//import {Logger} from "angular2-logger/core";

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
    if (this.course['isNew'] == null) {
      this.course['isNew'] = true;
    }

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

  visibilityChange(event:VisibilityEvent) {
    // Is it visible ?
    if ((event.topVisible && event.percentVisible > 0.4) || (event.percentVisible > 0.8)) {
      this.course.dateSeen = this.course.dateSeen || new Date();
      this.calcNew();
    } else {
      // If not visible any more and has been visible for less than 500 milli... it has not been seen
      if (this.course.dateSeen && (new Date().getTime() - this.course.dateSeen.getTime()) < 500) {
        this.course.dateSeen = null;
        this.calcNew();
      }
    }
  }

  newTimeout;
  calcNew() {
    this.course.isNew =  ((this.course.dateSeen == null) || ((new Date().getTime() - this.course.dateSeen.getTime()) < 1000*60));
    if (this.course.isNew) {
      // TODO: Update course in the Db
    }

    if (this.course.dateSeen && this.course.isNew) {
      this.newTimeout = setTimeout(() =>
      {
        this.calcNew();
      },
      10000)
    } else {
      if (this.newTimeout) {
        clearTimeout(this.newTimeout);
      }
    }
  }


}
