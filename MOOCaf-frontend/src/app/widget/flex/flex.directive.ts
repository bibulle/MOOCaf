import {Directive, Input, HostBinding} from "@angular/core";

@Directive({
  selector:'[flex]'
})
export class FlexDirective{
  @Input() shrink:number = 1;
  @Input() grow:number = 1;
  @Input() flex:string;

  //@HostBinding('style.flex')
  //get style(){
  //  return `${this.grow} ${this.shrink} ${this.flex === '' ? '0':this.flex}%`;
  //}

  @HostBinding('class.flex-100') get flex100() {return this.flex == '100'}
  @HostBinding('class.flex-95' ) get flex95() {return this.flex == '95'}
  @HostBinding('class.flex-90') get flex90() {return this.flex == '90'}
  @HostBinding('class.flex-85') get flex85() {return this.flex == '85'}
  @HostBinding('class.flex-80') get flex80() {return this.flex == '80'}
  @HostBinding('class.flex-75') get flex75() {return this.flex == '75'}
  @HostBinding('class.flex-70') get flex70() {return this.flex == '70'}
  @HostBinding('class.flex-65') get flex65() {return this.flex == '65'}
  @HostBinding('class.flex-60') get flex60() {return this.flex == '60'}
  @HostBinding('class.flex-55') get flex55() {return this.flex == '55'}
  @HostBinding('class.flex-50') get flex50() {return this.flex == '50'}
  @HostBinding('class.flex-45') get flex45() {return this.flex == '45'}
  @HostBinding('class.flex-40') get flex40() {return this.flex == '40'}
  @HostBinding('class.flex-35') get flex35() {return this.flex == '35'}
  @HostBinding('class.flex-30') get flex30() {return this.flex == '30'}
  @HostBinding('class.flex-25') get flex25() {return this.flex == '25'}
  @HostBinding('class.flex-20') get flex20() {return this.flex == '20'}
  @HostBinding('class.flex-15') get flex15() {return this.flex == '15'}
  @HostBinding('class.flex-10') get flex10() {return this.flex == '10'}
  @HostBinding('class.flex-5') get flex5() {return this.flex == '5'}
  @HostBinding('class.flex-0') get flex0() {return this.flex == '0'}

  //@HostBinding('class') get flexNum() {return 'flex-'+(this.flex === '' ? '0':this.flex)}
}
