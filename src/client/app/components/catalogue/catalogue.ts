import {Component} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'catalogue',
  templateUrl: 'catalogue.html',
  styleUrls: ['catalogue.css']
})

export class CatalogueComponent {

  followed: number = 0;
  favorite: number = 0;
  sort: number = 0;
  sortType: number = 0;

  constructor() {
  }

  ngOnInit() {
  }


  toggleFollowed() {
    this.followed = (this.followed+1) % 3;
  }
  toggleFavorite() {
    this.favorite = (this.favorite+1) % 3;
  }
  toggleSort() {
    this.sort = (this.sort+1) % 6;
    this.sortType = Math.floor(this.sort/2);
  }

}
