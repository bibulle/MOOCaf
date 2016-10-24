import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SimpleNotificationsModule } from "angular2-notifications";
import { NotificationService } from "./notification.service";
import { SimpleNotificationComponent } from "./simple-notification/simple-notification.component";

@NgModule({
  imports: [
    CommonModule,
    SimpleNotificationsModule,
  ],
  declarations: [SimpleNotificationComponent],
  providers: [NotificationService],
  exports: [SimpleNotificationComponent]
})
export class NotificationModule {
}
