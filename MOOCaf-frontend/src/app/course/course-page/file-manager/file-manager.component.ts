import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef } from "@angular/material";
import { FileUploader, FileItem, ParsedResponseHeaders } from "ng2-file-upload";

const URL = '/api/';


@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver: boolean = false;

  @ViewChild('fileInput') fileInput;

  constructor (
    public dialogRef: MdDialogRef<FileManagerComponent>
  ) { }

  ngOnInit () {

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      item['errorMessage'] = response;
    }


  }

  public fileOverBase (e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public selectFile () {
    this.fileInput.nativeElement.click();
  }

}
