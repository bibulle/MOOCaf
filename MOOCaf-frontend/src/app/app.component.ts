import { Component } from '@angular/core';
import {Logger} from "angular2-logger/core";
import {CourseService} from "./course/course.service";
import {NotificationService} from "./widget/notification/notification.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  countCurrentCourses = 0;

  notificationMessage = "";
  showMessage = false;
  notificationTimeout = null;

  constructor(private _logger: Logger,
              private _courseService: CourseService,
              private _notificationService: NotificationService) {
  }

  // notification options
  public notificationsOptions = {
    timeOut: 5000,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    showProgressBar: true,
    pauseOnHover: true,
    preventDuplicates: false,
    preventLastDuplicates: "visible",
    rtl: false,
    animate: "scale",
    position: ["right", "bottom"]
  };

  ngOnInit() {
    // Has the user some "current course"
    this._courseService.currentCourseObservable().subscribe(
      count => {
        this.countCurrentCourses = count;
      }
    );
    this._notificationService.getMessageEmmiter()
      .subscribe(message => {
        this.notificationMessage = message;
        this.showMessage = true;

        if (this.notificationTimeout != null) {
          clearTimeout(this.notificationTimeout);
        }

        this.notificationTimeout = setTimeout(() => {
            this.showMessage = false;
          },
          2000);
      })

  }

}
