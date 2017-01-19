import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { MdDialogRef, MdIconModule, MdDialogModule, MdTooltipModule, MdProgressBarModule } from "@angular/material";
import { FileUploader, FileUploadModule } from "ng2-file-upload";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FileManagerService, File } from "./file-manager.service";
import { FileComponent } from "./file/file.component";
import { NotificationService } from "../../../widget/notification/notification.service";

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {

  public courseId: string;

  private directory: File;

  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;


  @ViewChild('fileInput') fileInput;

  constructor (public dialogRef: MdDialogRef<FileManagerComponent>,
               private _fileManagerService: FileManagerService,
               private _notificationService: NotificationService) {}

  ngOnInit () {

    this.uploader = this._fileManagerService.getUploader(this.courseId);

    this.dialogRef.afterClosed().subscribe(() => {
      this.uploader.cancelAll();
      this.uploader.clearQueue();
    });

    // console.log("before Getfile");
    this._fileManagerService.getFiles(this.courseId)
        .then((directory) => {
          console.log(directory);
          this.directory = directory;
        })
        .catch((err) => {
          console.log(err);
          this._notificationService.error("Error", err)
        })


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
    FileUploadModule
  ],
  declarations: [
    FileManagerComponent,
    FileComponent
  ],
  entryComponents: [
    FileManagerComponent
  ],
  providers: [
    FileManagerService
  ],
  exports: [
    FileManagerComponent
  ]
})
export class FileManagerModule {
}

