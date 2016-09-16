import {Component} from "@angular/core";
import {Formation} from "../../models/formation";
import {Subject} from "rxjs/Subject";
import {Logger} from "angular2-logger/core";

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

  private formations: Formation[];
  sortedFormations: Formation[];


  // The queue to manage user choices
  private subjectFilter: Subject<{}>;
  private previousFilterJson: string = "";

  constructor(private _logger: Logger) {
  }

  ngOnInit() {

    // Apply UI changes
    if (!this.subjectFilter) {
      this.subjectFilter = new Subject<{}>();
      this.subjectFilter
        .debounceTime(500)
        .subscribe(
          filter => {
            this._filterList(filter);
          },
          error => {
            this._logger.error(error)
          }
        );
    }


    this.formations = [
      {
        name: "Starting a project with Big Data",
        createdDate: new Date('2016-08-12T00:00:00'),
        description: "A simple MOOC to learn how to start a Big Data project",
        note: 3.5,
        isFavorite: true,
        interest: 0.8,
        dateFollowed: new Date('2016-08-14T00:00:00'),
        percentFollowed: 0.8
      },
      {
        name: "What's new in JDK8",
        createdDate: new Date('2016-08-18T00:00:00'),
        description: "Just learn to use JDK8 new features",
        note: 4.0,
        isFavorite: false,
        interest: 0.2,
        dateFollowed: new Date('2016-08-22T00:00:00'),
        percentFollowed: 0.9
      },
      {
        name: "Learning machine learning with Spark",
        createdDate: new Date('2016-09-01T00:00:00'),
        description: "A simple introduction to Machine Learning with Spark ML",
        note: 2.0,
        isFavorite: false,
        interest: 0.8,
        dateFollowed: new Date('2016-09-23T00:00:00'),
        percentFollowed: 1
      },
      {
        name: "Is JDK9 going to break my project",
        createdDate: new Date('2016-08-26T00:00:00'),
        description: "What's new in JDK9",
        note: 4.5,
        isFavorite: false,
        interest: 0.3,
        dateFollowed: null,
        percentFollowed: 0
      },
      {
        name: "Using DevNet",
        createdDate: new Date('2016-08-12T00:00:00'),
        description: "A MOOC to learn using DevNet",
        note: 5.0,
        isFavorite: false,
        interest: 0.4,
        dateFollowed: null,
        percentFollowed: 0
      },
      {
        name: "MongoDb at a glance",
        createdDate: new Date('2016-07-14T00:00:00'),
        description: "What are the essentials to start with mongoDb",
        note: 4.5,
        isFavorite: false,
        interest: 0.1,
        dateFollowed: new Date('2016-08-12T00:00:00'),
        percentFollowed: 0.0
      },
      {
        name: "Spring Boot",
        createdDate: new Date('2016-10-28T00:00:00'),
        description: "WTF",
        note: 2.5,
        isFavorite: false,
        interest: 0.1,
        dateFollowed: new Date('2016-10-31T00:00:00'),
        percentFollowed: 1
      },
    ];
    this.filterList();
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

  /**
   * Add an event to sort/filter the formation list
   */
  filterList() {
    this.subjectFilter.next(this.filter);
  }

  /**
   * Really sort the formation list
   * @param filter the filter to apply
   * @private
   */
  private _filterList(filter: {}) {
    var filterJson = JSON.stringify(filter);
    if (this.previousFilterJson === filterJson) {
      return;
    }

    this.previousFilterJson = filterJson;

    this.sortedFormations = this.formations
      .filter(f => {
          var ret = true;
          ret = ret && ((filter['favorite'] != 1) || (f.isFavorite));
          ret = ret && ((filter['favorite'] != 2) || (!f.isFavorite));

          ret = ret && ((filter['followed'] != 1) || (f.dateFollowed != null));
          ret = ret && ((filter['followed'] != 2) || (f.dateFollowed == null));

          ret = ret && (f.name.concat(f.description).toLowerCase().includes(filter['search'].toLowerCase()));

          return ret;
        }
      )
      .sort((f1, f2) => {
        switch (filter['sort']) {
          case 0:
            return f2.createdDate.getTime() - f1.createdDate.getTime();
          case 1 :
            return f1.createdDate.getTime() - f2.createdDate.getTime();
          case 2 :
            return f2.note - f1.note;
          case 3 :
            return f1.note - f2.note;
          case 4 :
            return f2.interest - f1.interest;
          case 5 :
            return f1.interest - f2.interest;

          default:
            return 0;
        }
      });
  }
}
