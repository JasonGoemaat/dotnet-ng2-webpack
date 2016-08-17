// load requirements (polyfills)
import 'core-js';
import 'reflect-metadata';
import 'zone.js/dist/zone';

// lodash and jquery libraries
require('script!../node_modules/jquery/dist/jquery.min.js');
require('script!../node_modules/lodash/lodash.min.js');

// other libs used by us, to go in vendor bundle
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/core';
import '@angular/platform-browser-dynamic';
import 'rxjs';

// Wijmo styles and scripts (not *.angular2 modules)
// require('style!css!../node_modules/wijmo/styles/wijmo.min.css');
// require('style!css!../node_modules/wijmo/styles/themes/wijmo.theme.cleanlight.min.css');
// require('script!../node_modules/wijmo/controls/wijmo.min.js');
// require('script!../node_modules/wijmo/controls/wijmo.input.min.js');
