'use strict';

/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
// to install new library : https://github.com/angular/angular-cli/wiki/3rd-party-libs
//    npm install moment --save
//    typings install dt~moment --global --save

// paths serve as alias
var paths = {
      'npm:': 'vendor/'
    };

// map tells the System loader where to look for things
var map = {
  // our app is within the app folder
  app:                                 'app',
  // angular bundles
  '@angular/core':                     'npm:@angular/core/bundles/core.umd.js',
  '@angular/common':                   'npm:@angular/common/bundles/common.umd.js',
  '@angular/compiler':                 'npm:@angular/compiler/bundles/compiler.umd.js',
  '@angular/platform-browser':         'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
  '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
  '@angular/http':                     'npm:@angular/http/bundles/http.umd.js',
  '@angular/router':                   'npm:@angular/router/bundles/router.umd.js',
  '@angular/forms':                    'npm:@angular/forms/bundles/forms.umd.js',
  // other libraries
  'rxjs':                              'npm:rxjs',
  'angular2-in-memory-web-api':        'npm:angular2-in-memory-web-api',

  // Mine
  'angular2-logger':                   'npm:angular2-logger',
  'angular2-notifications':            'npm:angular2-notifications',
  'angular2-jwt':                      'npm:angular2-jwt',
  'marked':                            'npm:marked',
  'highlight.js':                      'npm:highlightjs',

  // Material
  '@angular2-material':                'npm:@angular2-material',

};

const packages: any = {
  'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
  'angular2-logger': { defaultExtension: 'js' },
  'angular2-notifications': { main: 'components.js', defaultExtension: 'js' },
  'angular2-jwt': { main: 'angular2-jwt.js', defaultExtension: 'js' }
};
// packages tells the System loader how to load when no filename and/or no extension
var packages = {
  app:                          {main: './main.js',           defaultExtension: 'js'},
  rxjs:                         {                             defaultExtension: 'js'},
  'angular2-in-memory-web-api': {main: './index.js',          defaultExtension: 'js'},
  'angular2-logger':            {                             defaultExtension: 'js' },
  'angular2-notifications':     {main: './components.js',     defaultExtension: 'js' },
  'angular2-jwt':               {main: './angular2-jwt.js',   defaultExtension: 'js' },
  'marked':                     {main: './index.js',          defaultExtension: 'js', format: 'cjs' },
  'highlight.js':               {main: './highlight.pack.js', defaultExtension: 'js', format: 'cjs' },


  '@angular2-material/core':    {main: './core.js'                                 },
  '@angular2-material/button':  {main: './button.js'                               },
  '@angular2-material/card':    {main: './card.js'                                 },
  '@angular2-material/icon':    {main: './icon.js'                                 }
};


// Materials
var  materialPackageNames = [
  'all',
  'button',
  'button-toggle',
  'card',
  'checkbox',
  'core',
  'dialog',
  'grid-list',
  'icon',
  'input',
  'list',
  'menu',
  'progress-bar',
  'progress-circle',
  'radio',
  'sidenav',
  'slide-toggle',
  'slider',
  'tabs',
  'toolbar',
  'tooltip',
];
materialPackageNames.forEach(function (Material_PKG) {
  packages[("@angular2-material/" + Material_PKG)] = {
    format: 'cjs',
    main: Material_PKG + '.umd.js',
    defaultExtension: 'js'
  };
});

/** Type declaration for ambient System. */
declare var System: any;

(function (global) {
  System.config({
    paths: paths,
    map: map,
    packages: packages
  });
})(this);

