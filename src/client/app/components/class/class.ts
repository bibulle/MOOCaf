import {Component, Input} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import {Logger} from "angular2-logger/core";
import {Subject} from "rxjs/Subject";

import {NotificationService} from "../../services/notification.service";
import {CourseService} from "../../services/course.service";
import {Course, CoursePart} from "../../models/course";
import {Paragraph} from "../../models/paragraph";
import {ParagraphType} from "../../models/paragraph-type.enum";

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

  private selectedPartNums: number[] = [0];
  private selectedPart: CoursePart;
  private selectedPartLevel: number;
  private selectedPartIsLast: boolean;

  private deletePartClicked:boolean = false;

  //private scheduleClosed = true;

  // for previous value in the editor
  private _previousValue = "";
  // The queue to manage editor changes
  subjectEditor: Subject<CoursePart>;

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

  /**
   * Two way of init (probably could be two different component)
   *     First, the list of started class
   *     Second a specific class (known with it's Id)
   */

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
          .then(courses => {
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
          .then(course => {
            // If no part... add an fake one
            if (course.parts.length == 0) {
              course.parts.push(new CoursePart({
                title: "Not yet defined"
              }));
            }

            this.course = course;
            //console.log(course);


            // Action defined when editor is edited
            if (!this.subjectEditor) {
              this.subjectEditor = new Subject<CoursePart>();
              this.subjectEditor
                .debounceTime(500)
                .subscribe(
                  coursePart => {
                    //console.log(coursePart);
                    return this._courseService.saveCoursePart(this.course.id, this.selectedPartNums, coursePart)
                      .then(coursePart => {
                        this._notificationService.message("All your modifications have been saved...");

                        this.selectedPart = coursePart;
                        this._previousValue = this.selectedPart.title;
                      })
                      .catch(error => {
                        this._logger.error(error);
                        this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error));
                      });
                  },
                  error => {
                    this._logger.error(error)
                  }
                );
            }

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
  onNotifySelectedPart(selectedPartNums: number[]) {
    //this._logger.debug("onNotifySelectedPart "+selectedPartNums);


    var selectedPartLevel = 1;
    var isLast = (selectedPartNums[0] == this.course.parts.length - 1);
    var selectedPart = this.course.parts[selectedPartNums[0]];

    var workingArray = selectedPartNums.slice(1);

    while (workingArray.length != 0) {
      selectedPartLevel++;
      isLast = (workingArray[0] == selectedPart.parts.length - 1);
      selectedPart = selectedPart.parts[workingArray[0]];

      workingArray = workingArray.slice(1);
    }

    this.selectedPart = selectedPart;
    this.selectedPartLevel = selectedPartLevel;
    this.selectedPartNums = selectedPartNums;
    this.selectedPartIsLast = isLast;

    // Add an empty markdown paragraph if none
    if (!selectedPart.contents || (selectedPart.contents.length == 0)) {
      selectedPart.contents = [
        new Paragraph({
          type: ParagraphType.MarkDown,
          content: ""
        })
      ];
    }

    this._previousValue = this.selectedPart.title;
  }

  toggleEditMode() {
    this.edited = !this.edited;
  }

  /**
   * The editor field has been changed
   */
  editorChange() {
    if (this._previousValue !== this.selectedPart.title) {
      this.subjectEditor
        .next(this.selectedPart);
    }
  }

  moveUp() {
    this._logger.debug("moveUp");
    this._move(-1);
  }

  moveDown() {
    this._logger.debug("moveDown");
    this._move(+1);
  }

  /**
   * Move a part
   * @param direction (+1 for down or -1 for up)
   * @private
   */
  _move(direction: number) {
    let newSelectedPartNums = this.selectedPartNums.slice(0, -1);
    newSelectedPartNums.push(this.selectedPartNums[this.selectedPartNums.length - 1] + direction);

    this._courseService.movePart(this.course.id, this.selectedPartNums, newSelectedPartNums)
      .then(course => {
        this._notificationService.message("All your modifications have been saved...");

        this.course = course;
        this.onNotifySelectedPart(newSelectedPartNums);
      })
      .catch(error => {
        this._logger.error(error);
        this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error));
      });
  }

  addPageChild() {
    this._logger.debug("addPageChild");
  }

  addPageSibling() {
    this._logger.debug("addPageSibling");
  }

  deletePage() {
    if (!this.deletePartClicked) {
      this.deletePartClicked = true;
      setTimeout(() => {
          this.deletePartClicked = false;
        },
        3000);
    } else {
      this.deletePartClicked = false;
      this._courseService.deletePart(this.course.id, this.selectedPartNums)
        .then(course => {
          this._notificationService.message("All your modifications have been saved...");

          this.course = course;

          let newSelectedPartNums = this.selectedPartNums.slice();
          if (newSelectedPartNums[newSelectedPartNums.length - 1] != 0) {
            newSelectedPartNums[newSelectedPartNums.length - 1] = newSelectedPartNums[newSelectedPartNums.length - 1] - 1;
          } else if (newSelectedPartNums.length != 1) {
            newSelectedPartNums.slice(0,-1);
          } else {
            newSelectedPartNums= [0];
          }
          this.onNotifySelectedPart(newSelectedPartNums);
        })
        .catch(error => {
          this._logger.error(error);
          this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error));
        });
    }
  }

}
