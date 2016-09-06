import {Component} from "@angular/core";
import {ParagraphService} from "../services/paragraph.service";
import {Logger} from "angular2-logger/app/core/logger";
import {NotificationsService} from "angular2-notifications";
import {Paragraph} from "../model/paragraph";

@Component({
  moduleId: module.id,
  selector: 'page',
  templateUrl: 'page.html',
  styleUrls: [ 'page.css' ]
})
export class PageComponent {
  constructor(
    private paragraphService: ParagraphService,
    private _logger: Logger,
    private _service: NotificationsService
  ) { }

  ngOnInit() {
    this._logger.info('Init PageComponent');
    this.getParagraphs();
  }

  getParagraphs() {
    this.paragraphService.getParagraphs().then(paragraphs => {
      console.log(paragraphs);
      return this.markdowns = paragraphs
    });
  }

  markdowns: Paragraph[];
}
