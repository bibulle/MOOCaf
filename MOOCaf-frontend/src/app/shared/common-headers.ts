import {Headers} from "@angular/http";

export class CommonHeaders {

  public static contentHeaders = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  });

}
