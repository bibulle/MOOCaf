// Imports for loading & configuring the in-memory web api
import {XHRBackend} from '@angular/http';

import {Logger, LOG_LOGGER_PROVIDERS, INFO_LOGGER_PROVIDERS} from "angular2-logger/core";

import {InMemoryBackendService, SEED_DATA} from 'angular2-in-memory-web-api';
import {InMemoryDataService}               from './app/services/in-memory-data.service';


// The usual bootstrapping imports
import {bootstrap}      from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';

import {AppComponent, environment} from './app/';

let loggerProvider = LOG_LOGGER_PROVIDERS;
if (environment.production) {
  enableProdMode();
  loggerProvider = INFO_LOGGER_PROVIDERS;
}

bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  {provide: XHRBackend, useClass: InMemoryBackendService}, // in-mem server
  {provide: SEED_DATA, useClass: InMemoryDataService},      // in-mem server data
  loggerProvider
]).catch(
  err => console.error(err)
);

