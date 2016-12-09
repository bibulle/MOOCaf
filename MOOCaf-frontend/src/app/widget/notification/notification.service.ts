import {Injectable} from "@angular/core";
import {Logger} from "angular2-logger/core";
import {NotificationsService } from "angular2-notifications";
import {Subject} from "rxjs/Rx";
import { Notification } from "angular2-notifications/lib/notification.type";


@Injectable()
export class NotificationService {

  private _emitter: Subject<string> = new Subject<string>();


  constructor(private _logger: Logger,
              private _notificationService: NotificationsService) {
  }


  success(title: string, content: string, override?: any): Notification {
    console.log(title);
    return this._notificationService.success(title, content, override);
  }

  error(title: string, content: string, override?: any): Notification {
    return this._notificationService.error(title, content, override);
  }

  alert(title: string, content: string, override?: any): Notification {
    return this._notificationService.alert(title, content, override);
  }

  info(title: string, content: string, override?: any): Notification {
    return this._notificationService.info(title, content, override);
  }

  message(content) {
    this._emitter.next(content);
  }

  getMessageEmmiter() {
    return this._emitter;
  }

}
