'use strict';

// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

// to install new library : https://github.com/angular/angular-cli/wiki/3rd-party-libs
//    npm install moment --save
//    typings install dt~moment --global --save

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
  'marked': 'vendor/marked',
  'highlight.js': 'vendor/highlightjs',
  'angular2-in-memory-web-api': 'vendor/angular2-in-memory-web-api',
  'angular2-logger': 'vendor/angular2-logger',
  'angular2-notifications': 'vendor/angular2-notifications'
};

/** User packages configuration. */
const packages: any = {
  'marked':{ main: 'index.js', defaultExtension: 'js', format: 'cjs' },
  'highlight.js':{ main: 'highlight.pack.js', defaultExtension: 'js', format: 'cjs' },
  'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
  'angular2-logger': { defaultExtension: 'js' },
  'angular2-notifications': { main: 'components.js', defaultExtension: 'js' }
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/forms',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  'app/paragraph-markdown',
  'app/paragraph',
  'app/paragraph-form',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });
