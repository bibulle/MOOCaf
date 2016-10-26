import { Component, OnInit } from '@angular/core';
import { Course } from "../course/course";
import { Subject } from "rxjs";
import { Logger } from "angular2-logger/core";
import { CourseService } from "../course/course.service";
import { NotificationService } from "../widget/notification/notification.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {

  filter = {
    followed: 0,
    favorite: 0,
    sort: 0,
    sortType: 0,
    search: ""
  };

  private courses: Course[];
  sortedCourses: Course[];


  // The queue to manage user choices
  private subjectFilter: Subject<{}>;
  private previousFilterJson: string = "";

  // Show only current courses for this user
  private onlyCurrent = false;

  edited: boolean = false;

  constructor(private _logger: Logger,
              private _courseService: CourseService,
              private _notificationService: NotificationService,
              public router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.onlyCurrent = this.route.snapshot.data['onlyCurrent'];

    // Apply UI changes
    if (!this.subjectFilter) {
      this.subjectFilter = new Subject<{}>();
      this.subjectFilter
          .debounceTime(500)
          .subscribe(
            filter => {
              this._filterList(filter);
            },
            error => {
              this._logger.error(error)
            }
          );
    }

    this._courseService.getCourses(this.onlyCurrent)
        .then(courses => {
          if (this.onlyCurrent && (courses.length == 0)) {
            this.router.navigate(['catalogue']);
          } else if (this.onlyCurrent && (courses.length == 1)) {
            this.router.navigate(['class', courses[0].id]);
          } else {
            this.courses = courses;
            this.filterList();
          }
        })
        .catch(err => {
          this._notificationService.error("Error", err)
        });


  }


  toggleEditMode() {
    this.edited = !this.edited;
  }

  toggleFollowed() {
    this.filter.followed = (this.filter.followed + 1) % 3;
    this.filterList();
  }

  toggleFavorite() {
    this.filter.favorite = (this.filter.favorite + 1) % 3;
    this.filterList()
  }

  toggleSort() {
    this.filter.sort = (this.filter.sort + 1) % 6;
    this.filter.sortType = Math.floor(this.filter.sort / 2);
    this.filterList();
  }


  addCourse() {
      //this._logger.debug("addCourse");

      this._courseService.addCourse(this.onlyCurrent)
          .then(courses => {
            this.courses = courses;
            this.previousFilterJson="";
            this.filterList();
          })
          .catch(error => {
            this._logger.error(error);
            this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.message || error.error || error));
          });
  }

  /**
   * Add an event to sort/filter the course list
   */
  filterList() {
    this.subjectFilter.next(this.filter);
  }

  /**
   * Really sort the course list
   * @param filter the filter to apply
   * @private
   */
  private _filterList(filter: {}) {
    var filterJson = JSON.stringify(filter);
    if (this.previousFilterJson === filterJson) {
      return;
    }

    this.previousFilterJson = filterJson;

    this.sortedCourses = this.courses
                             .filter(f => {
                                 var ret = true;
                                 ret = ret && ((filter['favorite'] != 1) || (f.isFavorite));
                                 ret = ret && ((filter['favorite'] != 2) || (!f.isFavorite));

                                 ret = ret && ((filter['followed'] != 1) || (f.dateFollowed != null));
                                 ret = ret && ((filter['followed'] != 2) || (f.dateFollowed == null));

                                 ret = ret && (f.name.concat(f.description).toLowerCase().includes(filter['search'].toLowerCase()));

                                 return ret;
                               }
                             )
                             .sort((f1, f2) => {
                               //console.log(f1);
                               switch (filter['sort']) {
                                 case 0:
                                   return f2.created.getTime() - f1.created.getTime();
                                 case 1 :
                                   return f1.created.getTime() - f2.created.getTime();
                                 case 2 :
                                   return f2.note - f1.note;
                                 case 3 :
                                   return f1.note - f2.note;
                                 case 4 :
                                   return f2.interest - f1.interest;
                                 case 5 :
                                   return f1.interest - f2.interest;

                                 default:
                                   return 0;
                               }
                             });
  }

}
