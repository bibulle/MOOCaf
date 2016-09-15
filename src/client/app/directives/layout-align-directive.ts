import {Directive, Input, HostBinding} from "@angular/core";


@Directive({
  selector:'[layout-align]'
})
export class LayoutAlignDirective{
  @Input('layout-align') layoutAlign:string;


  @HostBinding('class.layout-align-start-center')  get layout1() {return this.layoutAlign == 'start center'}
  @HostBinding('class.layout-align-end-center')    get layout2() {return this.layoutAlign == 'end center'}
  @HostBinding('class.layout-align-center-center') get layout3() {return this.layoutAlign == 'center center'}
  @HostBinding('class.layout-align-start-stretch') get layout4() {return this.layoutAlign == 'start stretch'}

  constructor() {
    //console.log("---------------");
    //console.log(this.layout);
  }

  ngOnInit() {
    //console.log("===============");
    //console.log(this);
  }
}
