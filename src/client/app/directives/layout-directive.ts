import {Directive, Input, HostBinding} from "@angular/core";


@Directive({
  selector:'[layout]'
})
export class LayoutDirective{
  @Input() layout:string;
  @Input('layout-fill') layoutFill:string = null;
  @Input('layout-margin') layoutMargin:string = null;
  @Input('layout-wrap') layoutWrap:string = null;


  //@HostBinding('style.display') display = 'flex';

  // @HostBinding('style.flex-direction')
  // get direction(){
  //   return (this.layout === 'column') ? 'column':'row';
  // }

  @HostBinding('class.layout-column') get layoutcolumn() {return this.layout == 'column'}
  @HostBinding('class.layout-row')    get layoutrow()    {return this.layout == 'row'}
  @HostBinding('class.layout-fill')   get layoutfill()   {return this.layoutFill !== null}
  @HostBinding('class.layout-margin') get layoutmargin() {return this.layoutMargin !== null}
  @HostBinding('class.layout-wrap')   get layoutwrap()   {return this.layoutWrap !== null}

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
