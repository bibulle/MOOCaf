import {Directive, Input, HostBinding} from "@angular/core";


@Directive({
  selector:'[layout-align]'
})
export class LayoutAlignDirective{
  @Input('layout-align') layoutAlign:string;


  @HostBinding('class.layout-align-start-center')         get layout1() {return this.layoutAlign == 'start center'}
  @HostBinding('class.layout-align-end-center')           get layout2() {return this.layoutAlign == 'end center'}
  @HostBinding('class.layout-align-center-center')        get layout3() {return this.layoutAlign == 'center center'}
  @HostBinding('class.layout-align-start-stretch')        get layout4() {return this.layoutAlign == 'start stretch'}
  @HostBinding('class.layout-align-space-around')         get layout5() {return this.layoutAlign == 'space-around'}
  @HostBinding('class.layout-align-space-around-center')  get layout6() {return this.layoutAlign == 'space-around center'}
  @HostBinding('class.layout-align-space-between')        get layout7() {return this.layoutAlign == 'space-between'}
  @HostBinding('class.layout-align-space-between-center') get layout8() {return this.layoutAlign == 'space-between center'}
  @HostBinding('class.layout-align-start-start')          get layout9() {return this.layoutAlign == 'start start'}

  constructor() {
    //console.log("---------------");
    //console.log(this.layout);
  }

  ngOnInit() {
    //console.log("===============");
    //console.log(this);
  }
}
