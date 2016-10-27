import { Component, OnInit } from '@angular/core';
import { CoursePart, Course } from "../course";
import { Subject } from "rxjs";
import { NotificationService } from "../../widget/notification/notification.service";
import { CourseService } from "../course.service";
import { Logger } from "angular2-logger/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ParagraphType } from "../../paragraph/paragraph-type.enum";
import { Paragraph } from "../../paragraph/paragraph";
import { UserService } from "../../user/user.service";

@Component({
  selector: 'course-page',
  templateUrl: './course-page.component.html',
  styleUrls: ['./course-page.component.css']
})
export class CoursePageComponent implements OnInit {

  private currentCourseCount = 0;

  private course: Course;

  private selectedPartNums: number[] = [0];
  private selectedPart: CoursePart;
  private selectedPartLevel: number;
  private selectedPartIsLast: boolean;

  private deletePartClicked: boolean = false;

  // for previous value in the editor
  private _previousValue = "";
  // The queue to manage editor changes
  subjectEditor: Subject<CoursePart>;

  edited: boolean = false;

  private userIsAdmin: boolean = false;

  constructor(private route: ActivatedRoute,
              public router: Router,
              private _logger: Logger,
              private _courseService: CourseService,
              private _notificationService: NotificationService,
              private _userService: UserService) {

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

    // check user right
    this._userService.userObservable().subscribe(
      () => {
        this.userIsAdmin = this._userService.isAdmin();
      });


    let id = this.route.snapshot.params['id'];

    this._courseService.getCourse(id)
        .then(course => {

          //this._logger.debug(course);
          // If no part... add an fake one
          if (course.parts.length == 0) {
            course.parts.push(new CoursePart({
              title: "Not yet defined"
            }));
          }

          this.course = course;
          //console.log(course);

          // calculate the part to select (the first not finished)
          this.selectedPartNums = this._getFirstPartNotFinished(this.course.parts) || [0];

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
                                 this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error.error || error));
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


  /**
   * The selected part content change
   * @param selectedPart:CoursePart
   */
  onNotifySelectedPartContent(selectedPart: CoursePart) {
    //this._logger.debug("onNotifySelectedPartContent "+selectedPart);

    this.selectedPart = selectedPart;
  }

  /**
   * The selected part Num change
   * @param selectedPartNums:number[]
   */
  onNotifySelectedPartNum(selectedPartNums: number[]) {
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
      // and save it
      this._courseService.saveCoursePart(this.course.id, this.selectedPartNums, selectedPart)
          .then(coursePart => {
            this.selectedPart = coursePart;
          })
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
    //this._logger.debug("moveUp");
    this._move(-1);
  }

  moveDown() {
    //this._logger.debug("moveDown");
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
          this.onNotifySelectedPartNum(newSelectedPartNums);
        })
        .catch(error => {
          this._logger.error(error);
          this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error.error || error));
        });
  }

  addPageChild() {
    //this._logger.debug("addPageChild");

    let lastChildPartNums = this.selectedPartNums.slice();
    lastChildPartNums.push(this.selectedPart.parts ? this.selectedPart.parts.length : 0);

    this._addPage(lastChildPartNums);
  }

  addPageSibling() {
    //this._logger.debug("addPageSibling");

    let newPartNums = this.selectedPartNums.slice(0, -1);
    newPartNums.push(this.selectedPartNums[this.selectedPartNums.length - 1] + 1);

    this._addPage(newPartNums);
  }

  /**
   * Add a page at the path in parameter
   * @param newPartNums
   * @private
   */
  _addPage(newPartNums) {
    //this._logger.debug("_addPage("+newPartNums+")");

    this._courseService.addPart(this.course.id, newPartNums)
        .then(course => {
          this._notificationService.message("All your modifications have been saved...");

          this.course = course;

          this.onNotifySelectedPartNum(newPartNums);
        })
        .catch(error => {
          this._logger.error(error);
          this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error.error || error));
        });
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
              newSelectedPartNums = newSelectedPartNums.slice(0, -1);
            } else {
              newSelectedPartNums = [0];
            }
            this.onNotifySelectedPartNum(newSelectedPartNums);
          })
          .catch(error => {
            this._logger.error(error);
            this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error.error || error));
          });
    }
  }

  /**
   * Get the first not finished part (if some)
   * @param parts
   * @returns number[] or null
   * @private
   */
  _getFirstPartNotFinished(parts: CoursePart[]): number[] {

    let ret = null;

    if (!parts || (parts == null)) {
      return ret;
    }
    parts.forEach((part, index) => {
      if (!ret) {
        // check on content of the part (percent followed is counted with children)
        let paraCount = 0;
        let paraDoneCount = 0;
        part.contents.forEach(paragraph => {
            paraCount++;
            if (paragraph.userDone) {
              paraDoneCount++;
            }
          }
        );
        if (paraCount > paraDoneCount) {
          ret = [index];
        } else {
          let subRet = this._getFirstPartNotFinished(part.parts);
          if (subRet) {
            ret = [index].concat(subRet);
          }
        }
      }
    });

    return ret;

  }


}
