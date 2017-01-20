import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { MdDialogRef, MdIconModule, MdDialogModule, MdTooltipModule, MdProgressBarModule } from "@angular/material";
import { FileUploader, FileUploadModule } from "ng2-file-upload";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FileManagerService, File } from "./file-manager.service";
import { FileComponent } from "./file/file.component";
import { ClipboardModule } from "ngx-clipboard";
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {

  public courseId: string;

  private directory: File;
  private downloadBaseUrl: string;

  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;


  @ViewChild('fileInput') fileInput;

  private _filesSubscription = null;

  constructor (public dialogRef: MdDialogRef<FileManagerComponent>,
               private _fileManagerService: FileManagerService) {}

  ngOnInit () {

    // Get the uploader
    this.uploader = this._fileManagerService.getUploader(this.courseId);

    // Clean on dialog closing
    this.dialogRef.afterClosed().subscribe(() => {
      this.uploader.cancelAll();
      this.uploader.clearQueue();
    });

    // How to get the ulpoaded files ?
    this.downloadBaseUrl = `${environment.serverUrl}file/${this.courseId}`;

    // Subscribe to files changes
    this._filesSubscription = this._fileManagerService.currentRootFileObservable()
                                  .subscribe((file) => {
                                    this.directory = file;
                                  })
  }

  //noinspection JSUnusedGlobalSymbols
  ngOnDestroy () {
    this._filesSubscription.unsubscribe();
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
    ClipboardModule,
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

