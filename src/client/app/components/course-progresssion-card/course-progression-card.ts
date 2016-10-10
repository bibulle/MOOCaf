import {Component, Input} from "@angular/core";
import {Course} from "../../models/course";
import {CourseService} from "../../services/course.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../services/notification.service";
import {VisibilityEvent} from "../../directives/visible-directive";
import {Logger} from "angular2-logger/core";

@Component({
  moduleId: module.id,
  selector: 'course-progression-card',
  templateUrl: 'course-progression-card.html',
  styleUrls: ['course-progression-card.css']
})
export class CourseProgressionCardComponent {

  @Input()
  course: Course;

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
    this._calcProgression(this.course);

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
      if (!this.course.dateSeen) {
        this.course.dateSeen = new Date();
        this.calcNew();
        this._courseService.saveUserValues(this.course)
          .then(course => {
            this.course = course;
          })
          .catch(err => {
            this._notificationService.error("Error saving your choice", err.status+" : "+err.message);
          });
      }
    }
  }

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
   * CAlculate fake progression percent
   * @param course
   * @private
   */
  private _calcProgression(course: Course) {
    let percentTotal = course.percentFollowed;
    let partsCount = course.parts.length;

    let cpt = 30;
    let percentCount = 1;
    while ((cpt > 0) && (percentCount != 0)) {
      percentCount = percentTotal*partsCount;
      for (let i = 0 ; i < partsCount; i++) {
        let statTotal = percentCount;
        if (i != partsCount-1) {
          statTotal = percentTotal/2 + Math.random() * percentTotal/2 * (partsCount - i);
        }
        statTotal = Math.min(1, Math.max(0,statTotal));
        percentCount = percentCount - statTotal;

        course.parts[i]['percentFollowed'] = statTotal;

        course.parts[i]['stat3'] = Math.floor(40*Math.random() * 0.1 * statTotal)/40;
        course.parts[i]['stat2'] = Math.floor(50*Math.random() * 0.5 * statTotal)/50;
        course.parts[i]['stat1'] = statTotal - course.parts[i]['stat2'] - course.parts[i]['stat3'];

      }
      cpt--;
    }
  }
}
