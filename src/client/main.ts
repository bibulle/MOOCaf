
// Imports for loading & configuring the in-memory web api
// import {XHRBackend} from '@angular/http';
//
// import {Logger, LOG_LOGGER_PROVIDERS, INFO_LOGGER_PROVIDERS} from "angular2-logger/core";
// import {SimpleNotificationsModule} from "angular2-notifications";
//
// import {InMemoryBackendService, SEED_DATA} from 'angular2-in-memory-web-api';
// import {InMemoryDataService}               from './app/services/in-memory-data.service';
//
//
// // The usual bootstrapping imports
// import {bootstrap}      from '@angular/platform-browser-dynamic';
// import {enableProdMode} from '@angular/core';
// import {HTTP_PROVIDERS} from '@angular/http';
// import {environment} from "./app/environment";
// import {AppModule} from "./app/app.module";
//
// let loggerProvider = LOG_LOGGER_PROVIDERS;
// if (environment.production) {
//   enableProdMode();
//   loggerProvider = INFO_LOGGER_PROVIDERS;
// }
//
// bootstrap(AppModule, [
//   HTTP_PROVIDERS,
//   {provide: XHRBackend, useClass: InMemoryBackendService}, // in-mem server
//   {provide: SEED_DATA, useClass: InMemoryDataService},      // in-mem server data
//   loggerProvider,
//   //SimpleNotificationsModule
// ]).catch(
//   err => console.error(err)
// );



import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
