import { Component, OnInit, Input } from '@angular/core';
import { File, FileManagerService } from "../file-manager.service";
import { NotificationService } from "../../../../widget/notification/notification.service";
import { Logger } from "angular2-logger/core";
import { MdDialogRef } from "@angular/material";
import { FileManagerComponent } from "../file-manager.component";

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  @Input()
  file: File;

  @Input()
  level: number;

  @Input()
  courseId: string;

  @Input()
  downloadBaseUrl: string;

  deleteClicked = false;

  open: boolean = false;

  constructor(public dialogRef: MdDialogRef<FileManagerComponent>,
              private _logger: Logger,
              private _fileManagerService: FileManagerService,
              private _notificationService: NotificationService) { }

  ngOnInit() {}

  //noinspection JSMethodCanBeStatic
  getArrayOfNumber(level: number): number[] {
    return Array(level).fill(0);
  }

  clickArrow() {
    this.open = !this.open;
  }

  isDateToday():boolean {
    return (this.file.date && ((new Date(this.file.date)).setHours(0,0,0,0) == (new Date()).setHours(0,0,0,0)));
  }

  copiedToClipboard(url) {
    this._notificationService.info("Success", `URL has been copied to clipboard`);
    this.dialogRef.close('urlCopied');
  }

  deleteFile () {
    if (!this.deleteClicked) {
      this.deleteClicked = true;
      setTimeout(() => {
          this.deleteClicked = false;
        },
        3000);
    } else {
      this.deleteClicked = false;
      this._fileManagerService.deleteFile(this.courseId, this.file.path)
          .then(() => {
            this._notificationService.message("All your modifications have been saved...");
          })
          .catch(error => {
            this._logger.error(error);
            this._notificationService.error("System error !!", "Error saving you changes !!\n\t" + (error.statusText || error.message || error.error || error));
          });
    }
  }


}
