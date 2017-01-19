import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { FileUploader, FileItem } from "ng2-file-upload";
import { AuthHttp } from "angular2-jwt";
import { Response } from "@angular/http";
import { UserService } from "../../../user/user.service";

@Injectable()
export class FileManagerService {

  private filesUrl = environment.serverUrl + 'api/files';

  private _uploader: FileUploader = new FileUploader({ url: this.filesUrl + "/upload", removeAfterUpload: false });
  private _currentCourseId: string = "";
  private _lastJwtToken = "";

  constructor (private _authHttp: AuthHttp,
               private _userService: UserService) {
    this._uploader.onErrorItem = (item: FileItem, response: string) => {

      item['errorMessage'] = response;
      try {
        let obj = JSON.parse(response);
        item['errorMessage'] = obj.message || obj.error || obj;
      } catch (e) {
      }

    };

    // this._uploader.onProgressItem = (item, progress) => {
    // };

    this._authHttp.tokenStream.subscribe(
      value => {this._lastJwtToken = value}
    );

  }

  public getUploader (courseId: string): FileUploader {

    if (this._currentCourseId != courseId) {
      this._uploader.cancelAll();
      this._uploader.clearQueue();
    }

    this._uploader.setOptions({
      additionalParameter: { courseId: courseId },
      authToken: "Bearer " + this._lastJwtToken
    });

    //console.log(this._uploader);
    return this._uploader;
  }


  public getFiles (courseId: string): Promise<File> {
    // console.log("getFile");
    return new Promise<File>((resolve, reject) => {

      this._authHttp.get(this.filesUrl + "/" + courseId)
          .map((res: Response) => res.json().data as File)
          .subscribe(
            (file: File) => {
              this._setDateToFile(file);
              console.log(file);
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

