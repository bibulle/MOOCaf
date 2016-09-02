import {Directive, Input, HostBinding} from "@angular/core";


@Directive({
  selector:'[layout-align]'
})
export class LayoutAlignDirective{
  @Input('layout-align') layoutAlign:string;


  @HostBinding('class.layout-align-start-center') get layout1() {return this.layoutAlign == 'start center'}

  constructor() {
    //console.log("---------------");
    //console.log(this.layout);
  }

  ngOnInit() {
    //console.log("===============");
    //console.log(this);
  }
}
