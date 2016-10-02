import {Directive, OnInit, OnDestroy, ElementRef, Output, EventEmitter} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {Logger} from "angular2-logger/core";
import {ScrollService} from "../services/scroll.service";
import {ScrollDetectorData} from "./scroll-directive";

@Directive({
  selector: '[visibilityChange]'
})

export class VisibleDirective implements OnInit, OnDestroy {

  constructor(private _logger: Logger,
              private _scrollService: ScrollService,
              private _el: ElementRef) {
  }

  @Output('visibilityChange') visibilityChange = new EventEmitter<VisibilityEvent>();

  scrollDetectorId: string;

  private subscription: Subscription;

  ngOnInit() {

    var parent = this._el.nativeElement.parentElement;
    while (parent && !this.scrollDetectorId) {
      this.scrollDetectorId = parent.getAttribute('scroll-detector');
      parent = parent.parentElement;
    }

    if (!this.scrollDetectorId) {
      this._logger.error("'is-visible' component with no parents 'scroll-detector' !!'", this._el);
    } else {
      this.subscription = this._scrollService.getObservable(this.scrollDetectorId).subscribe(
        (data:ScrollDetectorData) => {
          //console.log(this.el);

          var elementHeight = this._el.nativeElement.offsetHeight;
          var elementTop = this._el.nativeElement.offsetTop;
          var elementBottom = elementTop + elementHeight;

          var heightVisible = Math.min(elementHeight, Math.max(0, Math.min(elementBottom - data.scrollTop, data.scrollBottom - elementTop)));

          var ret = new VisibilityEvent();
          ret.percentVisible = heightVisible / elementHeight;
          ret.topVisible = (data.scrollTop < elementTop) && (elementTop < data.scrollBottom);
          ret.bottomVisible = (data.scrollTop < elementBottom) && (elementBottom < data.scrollBottom);

          this.visibilityChange.emit(ret);
          //console.log(ret);
        });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

}

export class VisibilityEvent {
  percentVisible: number;
  topVisible: boolean;
  bottomVisible: boolean;
}

