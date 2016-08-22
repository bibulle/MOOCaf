import {NgModule, enableProdMode}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent}  from './app.component';
import {SimpleNotificationsModule} from "angular2-notifications";
import {HTTP_PROVIDERS, XHRBackend} from "@angular/http";
import {InMemoryBackendService, SEED_DATA} from "angular2-in-memory-web-api";
import {InMemoryDataService} from "./services/in-memory-data.service";
import {LOG_LOGGER_PROVIDERS, INFO_LOGGER_PROVIDERS} from "angular2-logger/core";
import {environment} from "./environment";
import {FormsModule} from "@angular/forms";

let loggerProvider = LOG_LOGGER_PROVIDERS;
if (environment.production) {
  enableProdMode();
  loggerProvider = INFO_LOGGER_PROVIDERS;
}

@NgModule({
  imports: [BrowserModule, SimpleNotificationsModule, FormsModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [HTTP_PROVIDERS,
    {provide: XHRBackend, useClass: InMemoryBackendService}, // in-mem server
    {provide: SEED_DATA, useClass: InMemoryDataService},      // in-mem server data
    loggerProvider]
})
export class AppModule {
}
