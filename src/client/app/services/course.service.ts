import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Logger} from "angular2-logger/app/core/logger";
import {AuthHttp} from "angular2-jwt";
import {contentHeaders} from "../common/headers";
import {UserService} from "./user.service";
import {Course} from "../models/course";
import {environment} from "../environment";
import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {Paragraph} from "../models/paragraph";

@Injectable()
export class CourseService {

  private coursesUrl = environment.serverUrl + 'api/course';

  private currentCourseCountSubject: BehaviorSubject<number>;

  constructor(private _logger: Logger,
              private authHttp: AuthHttp,
              private userService: UserService) {

    this.currentCourseCountSubject = new BehaviorSubject<number>(0);

    // Subscribe to user changes to know if there is a current class
    this.userService.userObservable().subscribe(
      user => {
        if (user.username) {
          this.checkCurrentCourse();
        } else {
          this.currentCourseCountSubject.next(0);
        }
      });


  }

  /**
   * Subscribe to know if current course changes
   */
  currentCourseObservable(): Observable<number> {
    return this.currentCourseCountSubject;
  }

  /**
   * local method to check if the user have some current courses
   */
  private checkCurrentCourse() {
    this.getCourses(true)
      .then(lst => {
        this.currentCourseCountSubject.next(lst.length);
      })
      .catch(err => {
          this.currentCourseCountSubject.next(0);
        }
      )
  }

  /**
   * get the courses for the connected user
   *      The Courses, the progression, favorite and interest of the user
   * @param currentOnly (should only return the "current" course ... thestarted and not yet finished)
   * @returns {Promise<Course[]>}
   */
  getCourses(currentOnly = false): Promise<Course[]> {
    return new Promise<Course[]>((resolve, reject) => {
        this.authHttp.get(this.coursesUrl + "?currentOnly=" + currentOnly)
          .map((res: Response) => res.json().data as Course[])
          .subscribe(
            data => {
              //console.log(data);
              data = data.map(course => {
                this.retrieveDates(course);
                this.calcBooleans(course);
                return course
              });
              //console.log(data);
              resolve(data);
            },
            err => {
              reject(err);
            },
          )
      }
    )
  }

  /**
   * get A course for the connected user
   *      The Paragraph, the progression, favorite and interest of the user
   * @returns {Promise<Course>}
   */
  getCourse(uid: string): Promise < Course > {
    return this.authHttp.get(`${this.coursesUrl}/${uid}`)
      .toPromise()
      .then(response => {
        var course = response.json().data as Course;
        this.retrieveDates(course);
        this.calcBooleans(course);
        return course;
      })
      .catch(error => this.handleError(error, this._logger));
  }

  /**
   * Save a course
   * @param course
   * @returns Promise<Course>
   */
  save(course: Course): Promise < Course > {
    if (course.id
    ) {
      return this.put(course);
    }
    return this.post(course);
  }


  /**
   * Save a course
   * @param course
   * @returns Promise<Course>
   */
// Add new Paragraph
  private
  post(course: Course): Promise < Course > {
    return this.authHttp
      .post(this.coursesUrl, JSON.stringify(course), {headers: contentHeaders})
      .toPromise()
      .then(res => {
        //this._service.success("Saved", "your change have been saved");
        var course = res.json().data as Course;
        this.retrieveDates(course);
        this.calcBooleans(course);
        return course;
      })
      .catch(error => this.handleError(error, this._logger));
  }

// Update existing Course
  private put(course: Course): Promise < Course > {
    let url = `${this.coursesUrl}/${course.id}`;
    return this.authHttp
      .put(url, JSON.stringify(course), {headers: contentHeaders})
      .toPromise()
      .then(() => {
        //this._service.success("Saved", "your change have been saved");
        return course
      });
//.catch(error => this.handleError(error, this._logger));
  }

  /**
   * save course user values (favorite, dateSeen, ...)
   * @returns {Promise<void>|Promise<Course>}
   * @param course Course
   */
  saveUserValues(course: Course): Promise < Course > {

    var userChoice = {
      //courseId: course.id,
      isFavorite: course.isFavorite,
      dateSeen: course.dateSeen,
      new: course.new,
      percentFollowed: course.percentFollowed,
    };

    let url = `${this.coursesUrl}/${course.id}/userValues`;
    return this.authHttp
      .put(url, userChoice, {headers: contentHeaders})
      .toPromise()
      .then(res => {
        //console.log('======');
        //console.log(res);
        //console.log('======');
        //this._service.success("Saved", "your change have been saved");
        this.checkCurrentCourse();

        var course = res.json().data as Course;
        this.retrieveDates(course);
        this.calcBooleans(course);
        return course;
      })
      .catch(error => this.handleError(error, this._logger));
  }

  /**
   * save course paragraphs (user choice)
   * @param fullUserChoice (UID and userchoice)
   * @returns {Promise<void>|Promise<T>}
   */
  saveUserChoice(courseId: string, paragraph: Paragraph): Promise<Paragraph> {

    var userChoice = {
      userChoice: paragraph.userChoice
    }

    let url = `${this.coursesUrl}/${courseId}/${paragraph['_id']}/userChoice`;
    return this.authHttp
      .put(url, userChoice, {headers: contentHeaders})
      .toPromise()
      .then(res => {
        //console.log('======');
        //console.log(res);
        //console.log('======');
        //this._service.success("Saved", "your change have been saved");
        return res.json().data;
      })
      .catch(error => this.handleError(error, this._logger));
  }

  /**
   * check user choice
   * @param courseId
   * @param paragraph
   * @returns {Promise<TResult>}
   */
  checkUserChoice(courseId: string, paragraph: Paragraph): Promise<Paragraph> {

    var userChoice = {
      userChoice: paragraph.userChoice
    }

    let url = `${this.coursesUrl}/${courseId}/${paragraph['_id']}/userchoice/check`;
    return this.authHttp
      .put(url, userChoice, {headers: contentHeaders})
      .toPromise()
      .then(res => {
        //console.log(res.json().data);
        //this._service.success("Saved", "your change have been saved");
        return res.json().data;
      })
      .catch(error => this.handleError(error, this._logger));
  }


  private handleError(error: any, logger) {

    //console.log('======');
    //console.log(error);
    //logger.error(error);
    //console.log('======');

    this.userService.checkAuthent();

    if (typeof error.json === "function") {
      error = error.json()
    }

    var msg = error.message || error;

    logger.error('An error occurred : ' + msg);

    return Promise.reject(error);
  }

  /**
   * Methode to update the new value of the course
   * @param course
   */
  calcBooleans(course:Course) {
    course.new = ((course.dateSeen == null) || ((new Date().getTime() - course.dateSeen.getTime()) < 1000*60));
    course.done = ((course.dateFollowed != null) && (course.dateFollowedEnd != null));
    course.inProgress = ((course.dateFollowed != null) && (course.dateFollowedEnd == null));
  }

  /**
   * get dates fom json to date
   */
  retrieveDates(course: Course) {
    ['created', 'updated', 'dateSeen', 'dateFollowed', 'dateFollowedEnd']
      .map(s => {
        if (course[s]) {
          course[s] = new Date("" + course[s]);
        }
      });
  }

}
