import {NgModule, enableProdMode} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import {SimpleNotificationsModule} from "angular2-notifications";
import {HttpModule} from "@angular/http";
import {LOG_LOGGER_PROVIDERS, INFO_LOGGER_PROVIDERS} from "angular2-logger/core";
import {environment} from "./environment";
import {FormsModule} from "@angular/forms";
import {APP_ROUTES_PROVIDER} from "./app.routes";
import {UserService} from "./services/user.service";
import {AuthGuard} from "./auth.guard";
import {AUTH_PROVIDERS} from "angular2-jwt";

let loggerProvider = LOG_LOGGER_PROVIDERS;
if (environment.production) {
  enableProdMode();
  loggerProvider = INFO_LOGGER_PROVIDERS;
}

@NgModule({
  imports: [BrowserModule, SimpleNotificationsModule, FormsModule, HttpModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [loggerProvider, APP_ROUTES_PROVIDER, UserService, AuthGuard, AUTH_PROVIDERS]
})
export class AppModule {
}
