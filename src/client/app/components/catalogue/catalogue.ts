import {Component} from "@angular/core";
import {Formation} from "../../models/formation";
import {Subject} from "rxjs/Subject";
import {Logger} from "angular2-logger/core";
import {FormationService} from "../../services/formation.service";
import {NotificationsService} from "angular2-notifications";

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

  constructor(
    private _logger: Logger,
    private _formationService: FormationService,
    private _notificationService: NotificationsService) {
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

    this._formationService.getFormations()
      .then(formations =>
        {
          this.formations = formations;
          this.filterList();
        })
      .catch(err => {
        this._notificationService.error("Error", err)
      });


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
        //console.log(f1);
        switch (filter['sort']) {
          case 0:
            return f2.created.getTime() - f1.created.getTime();
          case 1 :
            return f1.created.getTime() - f2.created.getTime();
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
