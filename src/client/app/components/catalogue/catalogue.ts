import {Component} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'catalogue',
  templateUrl: 'catalogue.html',
  styleUrls: ['catalogue.css']
})

export class CatalogueComponent {

  filter = {
    followed: 0,
    favorite: 0,
    sort: 0,
    sortType: 0,
    search: ""
  };



  constructor() {
  }

  ngOnInit() {
  }


  toggleFollowed() {
    this.filter.followed = (this.filter.followed + 1) % 3;
    this.filterList();
  }

  toggleFavorite() {
    this.filter.favorite = (this.filter.favorite + 1) % 3;
    this.filterList()
  }

  toggleSort() {
    this.filter.sort = (this.filter.sort + 1) % 6;
    this.filter.sortType = Math.floor(this.filter.sort / 2);
    this.filterList();
  }

  filterList() {

  }
}
