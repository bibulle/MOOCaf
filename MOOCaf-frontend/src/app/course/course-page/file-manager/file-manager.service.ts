import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { FileUploader, FileItem } from "ng2-file-upload";
import { AuthHttp } from "angular2-jwt";

@Injectable()
export class FileManagerService {

  private filesUrl = environment.serverUrl + 'api/files/upload';

  private _uploader: FileUploader = new FileUploader({ url: this.filesUrl, removeAfterUpload: false });
  private _currentCourseId: string = "";
  private _lastJwtToken = "";

  constructor (private _authHttp: AuthHttp) {
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
      authToken: "Bearer "+this._lastJwtToken
    });

    //console.log(this._uploader);
    return this._uploader;
  }

}
