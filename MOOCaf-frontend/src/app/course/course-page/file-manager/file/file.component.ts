import { Component, OnInit, Input } from '@angular/core';
import { File } from "../file-manager.service";

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

  open: boolean = false;

  constructor() { }

  ngOnInit() {}

  //noinspection JSMethodCanBeStatic
  getArrayOfNumber(level: number): number[] {
    return Array(level).fill(0);
  }

  clickArrow() {
    this.open = !this.open;
  }

}
