import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Course } from "../../course/course";
import { Router } from "@angular/router";
import { Logger } from "angular2-logger/core";
import { CourseService } from "../../course/course.service";
import { NotificationService } from "../../widget/notification/notification.service";
import { VisibilityEvent } from "../../widget/scroll-detector/visible.directive";

@Component({
  selector: 'course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent implements OnInit {

  @Input()
  course: Course;

  @Input()
  edited: boolean = false;

  @Output()
  notifyCoursesChange: EventEmitter<void> = new EventEmitter<void>();

  private deleteCourseClicked: boolean = false;
  editorInError = false;

  constructor(public router: Router,
              private _logger: Logger,
              private _courseService: CourseService,
              private _notificationService: NotificationService) {
  }

  ngOnInit() {
    if (this.course.new == null) {
      this.course.new = true;
    }

    //this._logger.debug(this.course);

  }

  /**
   * Toggle the favorite button
   * @param event
   */
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
          this._logger.error(err);
          this._notificationService.error("Error saving your choice", err.status+" : "+err.message);
        });

  }

  /**
   * A class has been clicked
   * @param event
   */
  launchClass(event) {
    event.stopPropagation();
    this.router.navigate(['/class', this.course.id]);
  }

  /**
   * On scrolling, is this cours card visible
   * @param event
   */
  visibilityChange(event:VisibilityEvent) {
    // Is it visible ?
    if ((event.topVisible && event.percentVisible > 0.4) || (event.percentVisible > 0.8)) {
      if (!this.course.dateSeen) {
        this.course.dateSeen = new Date();
        this.calcNew();
        this._courseService.saveUserValues(this.course)
            .then(course => {
              this.course = course;
            })
            .catch(err => {
              this._logger.error(err);
              this._notificationService.error("Error saving your choice", err.status+" : "+err.message);
            });
      }
    }
  }


  /**
   * Calc if the course is new
   */
  newTimeout;
  calcNew() {
    CourseService.calcBooleans(this.course);

    if (this.course.dateSeen && this.course.new) {
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


  /**
   * SAve the cours on edition
   */
  saveCourse() {
    this._courseService.saveCourse(this.course)
        .then(course => {
          //console.log(course);
          this._notificationService.message("Your changes have been saved");
          this.course = course;
        })
        .catch(err => {
          this._logger.error(err);
          this._notificationService.error("Error saving your choice", err.status+" : "+err.message);
        });

  }

  /**
   * remove this course
   */
  deleteCourse() {
    if (!this.deleteCourseClicked) {
      this.deleteCourseClicked = true;
      setTimeout(() => {
          this.deleteCourseClicked = false;
        },
        3000);
    } else {
      this.deleteCourseClicked = false;
      this._courseService.deleteCourse(this.course)
          .then(() => {
            this._notificationService.message("All your modifications have been saved...");

            this.notifyCoursesChange.emit()
          })
          .catch(error => {
            this._logger.error(error);
            this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error.error || error));
          });
    }
  }

  /**
   * reset a course (remove all users values and choices about this course)
   */
  resetCourse() {
    this._courseService.resetCourse(this.course.id)
        .then(() => {
          //console.log(course);
          this._notificationService.message("Your changes have been saved");

          this.notifyCoursesChange.emit()
        })
        .catch(error => {
          this._logger.error(error);
          this._notificationService.error("System error !!", "Error resetting the course !!\n\t" + (error.message || error.error || error));
        });
  }

  /**
   * publish a course
   */
  publishCourse() {
    if (this.course.publishDate) {
      this.course.publishDate = null;
    } else {
      this.course.publishDate = new Date();
    }
    this.saveCourse();
  }

}
