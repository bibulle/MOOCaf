import {Component, OnChanges, SimpleChanges} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import {Logger} from "angular2-logger/core";
import {NotificationService} from "../../services/notification.service";

import {CourseService} from "../../services/course.service";
import {Course, CoursePart} from "../../models/course";
import {ParagraphType} from "../../models/paragraph-type.enum";
import {Paragraph} from "../../models/paragraph";
import {ParagraphContentType} from "../../models/paragraph-content-type.enum";

@Component({
  moduleId: module.id,
  selector: 'class',
  templateUrl: 'class.html',
  styleUrls: ['class.css']
})

export class ClassComponent {

  private currentCourseCount = 0;
  private courses: Course[];

  private course: Course;

  private selectedPartNums: number[];
  private selectedPart: CoursePart;
  private selectedPartLevel: number;

  private scheduleClosed = true;

  edited: boolean = false;

  constructor(private route: ActivatedRoute,
              public router: Router,
              private _logger: Logger,
              private _courseService: CourseService,
              private _notificationService: NotificationService) {

    /// Get current course count
    this._courseService.currentCourseObservable().subscribe(
      count => {
        this.currentCourseCount = count;
      }
    );

  }

  ngOnInit() {

    this.course = null;
    this.courses = null;

    this.route.params.forEach((params: Params) => {
      let id = params['id'];

      if (id == null) {
        // -----------------------------------------------
        // id is undefined, it's general class page asked
        // -----------------------------------------------
        this._courseService.getCourses(true)
          .then(courses =>
          {
            this.courses = courses
              .sort((f1, f2) => {
                if (f1.dateFollowed && f2.dateFollowed) {
                  return f2.dateFollowed.getTime() - f1.dateFollowed.getTime();
                } else {
                  return 0;
                }
              });
            if (this.courses.length == 0) {
              this.router.navigate(['/catalogue']);
            } else if (this.courses.length == 1) {
              this.router.navigate(['/classes', this.courses[0].id]);
            }
          })
          .catch(err => {
            this._notificationService.error("Error", err)
          });

      } else {
        // ---------------------------------
        // id is defined, only one course
        // ---------------------------------
        this._courseService.getCourse(id)
          .then(course =>
          {
            // If no part... add an fake one
            if (course.parts.length == 0) {
              course.parts.push(new CoursePart({title: "Not yet defined"}));
            }

            this.course = course;
            //console.log(course);

          })
          .catch(err => {
            this._logger.error(err);
            this._notificationService.error("Error", err)
          });
      }






    });


  }


  /**
   * The selected part change
   * @param selectedPartNums:number[]
   */
  onNotifySelectedPart(selectedPartNums:number[]) {

    var selectedPart = this.course.parts[selectedPartNums[0]];
    var selectedPartLevel = 1;

    if ((selectedPartNums.length > 1) && (selectedPartNums[1] != null)) {
      selectedPart = selectedPart.parts[selectedPartNums[1]];
      selectedPartLevel = 2;

    }

    this.selectedPart = selectedPart;
    this.selectedPartLevel = selectedPartLevel;
    this.selectedPartNums = selectedPartNums;
  }

  toggleEditMode() {
    this.edited = !this.edited;
  }



}
