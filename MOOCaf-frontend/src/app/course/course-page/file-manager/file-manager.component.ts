import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { MdDialogRef, MdIconModule, MdDialogModule, MdTooltipModule, MdProgressBarModule } from "@angular/material";
import { FileUploader, FileItem, FileUploadModule } from "ng2-file-upload";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

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

    this.uploader.onErrorItem = (item: FileItem,
                                 response: string) => {
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

@NgModule({
  imports: [
    CommonModule,
    MdIconModule,
    MdDialogModule.forRoot(),
    MdTooltipModule,
    MdProgressBarModule,
    FormsModule,
    FileUploadModule,
  ],
  declarations: [
    FileManagerComponent
  ],
  entryComponents: [
    FileManagerComponent
  ],
  exports: [
    FileManagerComponent
  ]
})
export class FileManagerModule {
}

