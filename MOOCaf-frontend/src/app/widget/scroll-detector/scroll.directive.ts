import {Directive, Input, OnInit, OnDestroy, HostListener, ElementRef} from "@angular/core";

import {Subject} from "rxjs/Subject";
import {Logger} from "angular2-logger/core";

import {ScrollService} from "./scroll.service";


@Directive({
  selector:'[scroll-detector]'
})
export class ScrollDirective implements OnInit, OnDestroy {

  private subjectScroll: Subject<ScrollDetectorData>;

  constructor (private _logger : Logger,
               private _scrollService : ScrollService,
               private el: ElementRef) {
  }

  @Input('scroll-detector')
  scrollDetectorId:string;

  private _firstDone = false;

  @HostListener('scroll', ['$event'])
  onScroll() {
    if (this.subjectScroll) {
      this.subjectScroll.next(new ScrollDetectorData(this.el.nativeElement));
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    //console.log('resize  ');
    if (this.subjectScroll) {
      this.subjectScroll.next(new ScrollDetectorData(this.el.nativeElement));
    }
  }

  ngOnInit() {
    // this._logger.debug("ScrollDirective ngOnInit");
    if (!this.scrollDetectorId) {
      return this._logger.error('scroll-detector: Missing id.');
    }

    if (!!this._scrollService.getObservable(this.scrollDetectorId)) {
      this._logger.error('scroll-detector: duplicate id "' + this.scrollDetectorId + '". Instance will be skipped!');
    } else {
      this.subjectScroll = new Subject<ScrollDetectorData>();
      this._scrollService.setObservable(this.scrollDetectorId, this.subjectScroll, this);
    }
  }

  ngAfterViewChecked() {
    // this._logger.debug("ScrollDirective ngAfterViewChecked");
    if (!this._firstDone && this.el.nativeElement.offsetHeight != 0) {
      this._firstDone = true;
      if (this.subjectScroll) {
        this.subjectScroll.next(new ScrollDetectorData(this.el.nativeElement));
      }
    }
  }

  ngOnDestroy() {
    // this._logger.debug("ScrollDirective ngOnDestroy");
    this._scrollService.deleteObservable(this.scrollDetectorId);
  }


}

export class ScrollDetectorData {
  scrollTop: number;
  scrollBottom: number;
  scrollHeight: number;
  element: any;

  constructor(el : any) {
    this.scrollHeight = el.offsetHeight;
    this.scrollTop    = el.scrollTop; // + el.offsetTop;
    this.scrollBottom = this.scrollTop + this.scrollHeight;
    this.element = el;
  }
}
