import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { FileUploader, FileItem } from "ng2-file-upload";
import { AuthHttp } from "angular2-jwt";
import { Response } from "@angular/http";
import { UserService } from "../../../user/user.service";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class FileManagerService {

  private filesUrl = environment.serverUrl + 'api/files';

  private _uploader: FileUploader = new FileUploader({ url: this.filesUrl + "/upload", removeAfterUpload: false });
  private _currentCourseId: string = "";
  private _lastJwtToken = "";

  private currentRootFileSubject: BehaviorSubject<File>;


  constructor (private _authHttp: AuthHttp,
               private _userService: UserService) {

    // Get the last JWT token
    this._authHttp.tokenStream.subscribe(
      value => {this._lastJwtToken = value}
    );

    this.currentRootFileSubject = new BehaviorSubject<File>(new File());

    // On upload error, add error message to item
    this._uploader.onErrorItem = (item: FileItem, response: string) => {
      item['errorMessage'] = response;
      try {
        let obj = JSON.parse(response);
        item['errorMessage'] = obj.message || obj.error || obj;
      } catch (e) {
      }

    };

    // On upload, update current root files
    this._uploader.onSuccessItem = () => {
      this._updateFilesObservable();
    };


  }

  /**
   * Subscribe to know if current File change
   */
  currentRootFileObservable(): Observable<File> {
    return this.currentRootFileSubject;
  }

  /**
   * Update observable with new file list
   * @private
   */
  _updateFilesObservable() {
    // console.log("_updateFilesObservable");
    this._getFiles(this._currentCourseId)
      .then(file => {
        this.currentRootFileSubject.next(file);
      })
      .catch(err => {
        console.log(err);
      });
  }

  /**
   * get an uploader object (configured)
   * @param courseId
   * @returns {FileUploader}
   */
  public getUploader (courseId: string): FileUploader {

    if (this._currentCourseId != courseId) {
      this._uploader.cancelAll();
      this._uploader.clearQueue();
      this._currentCourseId = courseId;
      this._updateFilesObservable();
    }

    this._uploader.setOptions({
      additionalParameter: { courseId: courseId },
      authToken: "Bearer " + this._lastJwtToken
    });

    //console.log(this._uploader);
    return this._uploader;
  }

  /**
   * get files list in a courses
   * @param courseId
   * @returns {Promise<File>}
   */
  public _getFiles (courseId: string): Promise<File> {
    // console.log("getFile");
    return new Promise<File>((resolve, reject) => {

      this._authHttp.get(this.filesUrl + "/" + courseId)
          .map((res: Response) => res.json().data as File)
          .subscribe(
            (file: File) => {
              this._setDateToFile(file);
              // console.log(file);
              resolve(file);
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
    });
  }

  /**
   * Delete a file in a course
   * @param courseId
   * @param path
   */
  deleteFile (courseId: string, path: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this._authHttp.delete(this.filesUrl + "/" + courseId+path)
          .subscribe(
            () => {
              this._updateFilesObservable();
              resolve();
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
    });
  }

  private _setDateToFile(file:File) {
    file.date = new Date(file.date);

    if (file.children) {
      file.children.forEach(f => {
        this._setDateToFile(f);
      })
    }
  }

}

export class File {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  date: Date;

  children: File[];
  
}

