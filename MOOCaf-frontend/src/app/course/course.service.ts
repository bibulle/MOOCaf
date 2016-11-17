import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Logger } from "angular2-logger/app/core/logger";
import { Observable, BehaviorSubject } from "rxjs/Rx";
import { environment } from "../../environments/environment";
import { AuthHttp } from "angular2-jwt";
import { UserService } from "../user/user.service";
import { Course, CoursePart } from "./course";
import { CommonHeaders } from "../shared/common-headers";
import { Paragraph } from "../paragraph/paragraph";
import { ParagraphType } from "../paragraph/paragraph-type.enum";
import { ParagraphContentType } from "../paragraph/paragraph-content-type.enum";
import { Job } from "../paragraph/job";

@Injectable()
export class CourseService {

  private coursesUrl = environment.serverUrl + 'api/course';

  private currentCourseCountSubject: BehaviorSubject<number>;

  constructor(private _logger: Logger,
              private authHttp: AuthHttp,
              private _userService: UserService) {

    this.currentCourseCountSubject = new BehaviorSubject<number>(0);

    // Subscribe to user changes to know if there is a current class
    this._userService.userObservable().subscribe(
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
            this._logger.debug(err);
            this.currentCourseCountSubject.next(0);
          }
        )
  }

  /**
   * get the courses for the connected user
   *      The Courses, the progression, favorite and interest of the user
   * @param currentOnly (should only return the "current" course ... the started and not yet finished)
   * @param progressOnly (should only return the "progress" course ... the started and finished or not)
   * @returns {Promise<Course[]>}
   */
  getCourses(currentOnly = false, progressOnly = false): Promise<Course[]> {
    return new Promise<Course[]>((resolve, reject) => {
        if (currentOnly && progressOnly) {
          reject("System error : You should choose only once")
        } else {
          this.authHttp.get(this.coursesUrl + "?currentOnly=" + currentOnly + "&progressOnly=" + progressOnly)
              .map((res: Response) => res.json().data as Course[])
              .subscribe(
                data => {
                  //console.log(data);
                  data = data.map(course => {
                    CourseService.retrieveDates(course);
                    CourseService.calcBooleans(course);
                    return course
                  });
                  //console.log(data);
                  resolve(data);
                },
                err => {
                  if (err['_body'] && (err['_body'] == "WRONG_USER")) {
                    this._userService.logout();
                    reject("You have been disconnected");
                  } else {
                    reject(err);
                  }
                },
              );
        }
      }
    )
  }

  addCourse(currentOnly = false, progressOnly = false): Promise<Course[]> {
    return new Promise<Course[]>((resolve, reject) => {
        if (currentOnly && progressOnly) {
          reject("System error : You should choose only once")
        } else {
          this.authHttp.get(this.coursesUrl + "/add" + "?currentOnly=" + currentOnly + "&progressOnly=" + progressOnly)
              .map((res: Response) => res.json().data as Course[])
              .subscribe(
                data => {
                  //console.log(data);
                  data = data.map(course => {
                    CourseService.retrieveDates(course);
                    CourseService.calcBooleans(course);
                    return course
                  });
                  //console.log(data);
                  resolve(data);
                },
                err => {
                  if (err['_body'] && (err['_body'] == "WRONG_USER")) {
                    this._userService.logout();
                    reject("You have been disconnected");
                  } else {
                    reject(err);
                  }
                },
              );
        }
      }
    )
  }

  /**
   * remove a course
   * @param course
   * @returns {Promise<Course[]>}
   */
  deleteCourse(course: Course): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      this.authHttp
          .delete(`${this.coursesUrl}/${course.id}`, {headers: CommonHeaders.contentHeaders})
          .subscribe(
            () => {
              resolve();
            },
            err => {
              if (err['_body'] && (err['_body'] == "WRONG_USER")) {
                this._userService.logout();
                reject("You have been disconnected");
              } else {
                reject(err);
              }
            });
    })
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
                 // check if something change in current course thing
                 this.checkCurrentCourse();

                 var course = response.json().data as Course;
                 CourseService.retrieveDates(course);
                 CourseService.calcBooleans(course);
                 return course;
               })
               .catch(error => this.handleError(error, this._logger));
  }

  /**
   * reset a course (remove all users values and choices about this course)
   * @returns {Promise<Course>}
   */
  resetCourse(uid: string): Promise < void > {
    return this.authHttp.get(`${this.coursesUrl}/${uid}/reset`)
               .toPromise()
               .then(response => {
                 return response;
               })
               .catch(error => this.handleError(error, this._logger));
  }

  /**
   * Save a course
   * @param course
   * @returns Promise<Course>
   */
  saveCourse(course: Course): Promise < Course > {
    if (course.id) {
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
  private post(course: Course): Promise < Course > {
    return this.authHttp
               .post(this.coursesUrl, JSON.stringify(course), {headers: CommonHeaders.contentHeaders})
               .toPromise()
               .then(res => {
                 //this._service.success("Saved", "your change have been saved");
                 var course = res.json().data as Course;
                 CourseService.retrieveDates(course);
                 CourseService.calcBooleans(course);
                 return course;
               })
               .catch(error => this.handleError(error, this._logger));
  }

// Update existing Course
  private put(course: Course): Promise < Course > {
    let url = `${this.coursesUrl}/${course.id}`;
    return this.authHttp
               .put(url, JSON.stringify(course), {headers: CommonHeaders.contentHeaders})
               .toPromise()
               .then(() => {
                 //this._service.success("Saved", "your change have been saved");
                 return course
               });
//.catch(error => this.handleError(error, this._logger));
  }

  /**
   * save course part
   * @param courseId
   * @param selectedPartNums (path to the part)
   * @param coursePart the part to save
   * @returns {Promise<CoursePart>}
   */
  saveCoursePart(courseId: string, selectedPartNums: number[], coursePart: CoursePart): Promise<CoursePart> {

    //console.log(coursePart);

    let url = `${this.coursesUrl}/${courseId}/part/${selectedPartNums}`;
    return this.authHttp
               .put(url, coursePart, {headers: CommonHeaders.contentHeaders})
               .toPromise()
               .then(res => {
                 //console.log(res);
                 return res.json().data;
               })
               .catch(error => this.handleError(error, this._logger));
  }

  /**
   * move course part
   * @param courseId
   * @param srcSelectedPartNums
   * @param trgSelectedPartNums
   * @returns {Promise<Course>}
   */
  movePart(courseId: string, srcSelectedPartNums: number[], trgSelectedPartNums: number[]): Promise<Course> {

    let url = `${this.coursesUrl}/${courseId}/part/${srcSelectedPartNums}/move`;
    return this.authHttp
               .put(url, trgSelectedPartNums, {headers: CommonHeaders.contentHeaders})
               .toPromise()
               .then(res => {
                 //console.log(res);
                 return res.json().data;
               })
               .catch(error => this.handleError(error, this._logger));
  }

  /**
   * remove course part
   * @param courseId
   * @param srcSelectedPartNums
   * @returns {Promise<Course>}
   */
  deletePart(courseId: string, srcSelectedPartNums: number[]): Promise<Course> {

    let url = `${this.coursesUrl}/${courseId}/part/${srcSelectedPartNums}`;
    return this.authHttp
               .delete(url, {headers: CommonHeaders.contentHeaders})
               .toPromise()
               .then(res => {
                 //console.log(res);
                 return res.json().data;
               })
               .catch(error => this.handleError(error, this._logger));
  }

  /**
   * add a course part
   * @param courseId
   * @param srcSelectedPartNums
   * @returns {Promise<Course>}
   */
  addPart(courseId: string, srcSelectedPartNums: number[]): Promise<Course> {

    let url = `${this.coursesUrl}/${courseId}/part/${srcSelectedPartNums}/add`;
    return this.authHttp
               .put(url, {}, {headers: CommonHeaders.contentHeaders})
               .toPromise()
               .then(res => {
                 //console.log(res);
                 return res.json().data;
               })
               .catch(error => this.handleError(error, this._logger));
  }

  /**
   * save course paragraph
   * @param courseId
   * @param paragraphNums
   * @param paragraph
   * @returns {Promise<Paragraph>}
   */
  saveParagraph(courseId: string, paragraphNums: number[], paragraph: Paragraph): Promise<Paragraph> {

    //console.log(paragraph);

    let url = `${this.coursesUrl}/${courseId}/para/${paragraphNums}`;
    return this.authHttp
               .put(url, paragraph, {headers: CommonHeaders.contentHeaders})
               .toPromise()
               .then(res => {
                 //console.log(res);
                 return res.json().data;
               })
               .catch(error => this.handleError(error, this._logger));
  }

  /**
   * move course paragraph
   * @param courseId
   * @param srcSelectedParaNums
   * @param trgSelectedParaNum
   * @returns {Promise<CoursePart>}
   */
  moveParagraph(courseId: string, srcSelectedParaNums: number[], trgSelectedParaNum: number): Promise<CoursePart> {

    let url = `${this.coursesUrl}/${courseId}/para/${srcSelectedParaNums}/move`;
    return this.authHttp
               .put(url, {trgParaNum: trgSelectedParaNum}, {headers: CommonHeaders.contentHeaders})
               .toPromise()
               .then(res => {
                 //console.log(res);
                 return res.json().data;
               })
               .catch(error => this.handleError(error, this._logger));
  }

  /**
   * remove course paragraph
   * @param courseId
   * @param srcSelectedParaNums
   * @returns {Promise<CoursePart>}
   */
  deleteParagraph(courseId: string, srcSelectedParaNums: number[]): Promise<CoursePart> {

    let url = `${this.coursesUrl}/${courseId}/para/${srcSelectedParaNums}`;
    return this.authHttp
               .delete(url, {headers: CommonHeaders.contentHeaders})
               .toPromise()
               .then(res => {
                 //console.log(res);
                 return res.json().data;
               })
               .catch(error => this.handleError(error, this._logger));
  }

  /**
   * add course paragraph
   * @param courseId
   * @param srcSelectedParaNums
   * @param type
   * @param subType
   * @returns {Promise<CoursePart>}
   */
  addParagraph(courseId: string, srcSelectedParaNums: number[], type: ParagraphType, subType: ParagraphContentType): Promise<CoursePart> {

    let url = `${this.coursesUrl}/${courseId}/para/${srcSelectedParaNums}/add`;
    return this.authHttp
               .put(url, {type: type, subType: subType}, {headers: CommonHeaders.contentHeaders})
               .toPromise()
               .then(res => {
                 //console.log(res);
                 return res.json().data;
               })
               .catch(error => this.handleError(error, this._logger));
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
      'new': course.new,
      percentFollowed: course.percentFollowed,
    };

    let url = `${this.coursesUrl}/${course.id}/userValues`;
    return this.authHttp
               .put(url, userChoice, {headers: CommonHeaders.contentHeaders})
               .toPromise()
               .then(res => {
                 // check if something change in current course thing
                 this.checkCurrentCourse();

                 var course = res.json().data as Course;
                 CourseService.retrieveDates(course);
                 CourseService.calcBooleans(course);
                 return course;
               })
               .catch(error => this.handleError(error, this._logger));
  }

  /**
   * save course paragraphs (user choice)
   * @param courseId
   * @param paragraph
   * @returns {Promise<Paragraph>}
   */
  saveUserChoice(courseId: string, paragraph: Paragraph): Promise<Paragraph> {

    var userChoice = {
      userChoice: paragraph.userChoice,
      userDone: paragraph.userDone
    };

    let url = `${this.coursesUrl}/${courseId}/${paragraph['_id']}/userChoice`;
    return this.authHttp
               .put(url, userChoice, {headers: CommonHeaders.contentHeaders})
               .toPromise()
               .then(res => {
                 // check if something change in current course thing
                 this.checkCurrentCourse();

                 return res.json().data;
               })
               .catch(error => this.handleError(error, this._logger));
  }

  /**
   * test user choice (exec it on the serveur... for telnet or whatever)
   * @param courseId
   * @param paragraph
   * @returns {Promise<Job>}
   */
  testUserChoice(courseId: string, paragraph: Paragraph): Promise<Job> {

    var userChoice = {
      userChoice: paragraph.userChoice
    };

    let url = `${this.coursesUrl}/${courseId}/${paragraph['_id']}/userchoice/test`;
    return this.authHttp
               .put(url, userChoice, {headers: CommonHeaders.contentHeaders})
               .toPromise()
               .then(res => {
                 // check if something change in current course thing
                 this.checkCurrentCourse();

                 return res.json().data;
               })
               .catch(error => this.handleError(error, this._logger));
  }

  /**
   * check user choice
   * @param courseId
   * @param paragraph
   * @returns {Promise<Job>}
   */
  checkUserChoice(courseId: string, paragraph: Paragraph): Promise<Job> {

    var userChoice = {
      userChoice: paragraph.userChoice
    };

    let url = `${this.coursesUrl}/${courseId}/${paragraph['_id']}/userchoice/check`;
    return this.authHttp
               .put(url, userChoice, {headers: CommonHeaders.contentHeaders})
               .toPromise()
               .then(res => {
                 // check if something change in current course thing
                 this.checkCurrentCourse();

                 return res.json().data;
               })
               .catch(error => this.handleError(error, this._logger));
  }


  private handleError(error: any, logger) {

    //console.log('======');
    //console.log(error);
    //logger.error(error);
    //console.log('======');

    this._userService.checkAuthent();

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
  static calcBooleans(course: Course) {
    // still new during half a minute after being seen
    course.new = ((course.dateSeen == null) || ((new Date().getTime() - course.dateSeen.getTime()) < 1000 * 30));
    // Done if there is a "date followed end"
    course.done = ((course.dateFollowed != null) && (course.dateFollowedEnd != null));
    // In progress if there is a "date followed" and no "date followed end"
    course.inProgress = ((course.dateFollowed != null) && (course.dateFollowedEnd == null));
  }

  /**
   * get dates fom json to date
   */
  static retrieveDates(course: Course) {
    ['publishDate', 'created', 'updated', 'dateSeen', 'dateFollowed', 'dateFollowedEnd']
      .map(s => {
        if (course[s]) {
          course[s] = new Date("" + course[s]);
        }
      });
  }

}
