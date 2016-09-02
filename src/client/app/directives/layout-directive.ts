import {Directive, Input, HostBinding} from "@angular/core";


@Directive({
  selector:'[layout]'
})
export class LayoutDirective{
  @Input() layout:string;


  //@HostBinding('style.display') display = 'flex';

  // @HostBinding('style.flex-direction')
  // get direction(){
  //   return (this.layout === 'column') ? 'column':'row';
  // }

  @HostBinding('class.layout-column') get layoutcolumn() {return this.layout == 'column'}
  @HostBinding('class.layout-row') get layoutrow() {return this.layout == 'row'}

  //@HostBinding('class') get layoutDirection() {return 'layout-'+this.layout}

  constructor() {
    //console.log("1---------------");
    //console.log(this.layout);
  }

  ngOnInit() {
    //console.log("1===============");
    //console.log(this);
  }

}
