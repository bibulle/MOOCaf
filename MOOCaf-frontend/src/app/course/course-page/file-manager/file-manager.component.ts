import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { MdDialogRef, MdIconModule, MdDialogModule, MdTooltipModule, MdProgressBarModule } from "@angular/material";
import { FileUploader, FileUploadModule } from "ng2-file-upload";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FileManagerService } from "./file-manager.service";

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {

  public courseId: string;
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;

  @ViewChild('fileInput') fileInput;

  constructor (public dialogRef: MdDialogRef<FileManagerComponent>,
               private _fileManagerService: FileManagerService) {}

  ngOnInit () {

    this.uploader = this._fileManagerService.getUploader(this.courseId);

    this.dialogRef.afterClosed().subscribe(() => {
      this.uploader.cancelAll();
      this.uploader.clearQueue();
    });


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
  providers: [
    FileManagerService
  ],
  exports: [
    FileManagerComponent
  ]
})
export class FileManagerModule {
}

