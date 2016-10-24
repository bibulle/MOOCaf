import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'simple-notification',
  templateUrl: './simple-notification.component.html',
  styleUrls: ['./simple-notification.component.css']
})
export class SimpleNotificationComponent implements OnInit {

  @Input()
  options: any;

  constructor() { }

  ngOnInit() {
  }

}
