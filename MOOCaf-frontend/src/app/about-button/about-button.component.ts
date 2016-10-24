import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'about-button',
  templateUrl: './about-button.component.html',
  styleUrls: ['./about-button.component.css']
})
export class AboutButtonComponent implements OnInit {

  user: {};


  constructor() {
  }
  ngOnInit() {
  }

  openAbout() {
    alert('Not yet implemented');
  }
}
