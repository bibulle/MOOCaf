import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { FileUploader, FileItem } from "ng2-file-upload";

@Injectable()
export class FileManagerService {

  private filesUrl = environment.serverUrl + 'api/files';

  private _uploader: FileUploader = new FileUploader({ url: this.filesUrl });

  constructor () {
    this._uploader.onErrorItem = (item: FileItem, response: string) => {

      item['errorMessage'] = response;
      try {
        let obj = JSON.parse(response);
        item['errorMessage'] = obj.error || obj;
      } catch (e) {}

    }

  }

  public getUploader (): FileUploader {
    return this._uploader;
  }

}
