// load requirements (polyfills)
// NOTE: using versino from angular2-webpack-starter below
// import 'core-js';
// import 'reflect-metadata';
// import 'zone.js/dist/zone';

// lodash and jquery libraries
// NOTE: these moved to CopyWebpackPlugin and loaded in index.html
// require('script!../node_modules/jquery/dist/jquery.min.js');
// require('script!../node_modules/lodash/lodash.min.js');


// ----- version straight from angular2-webpack-starter:
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/weak-map';
import 'core-js/es6/weak-set';
import 'core-js/es6/typed';
import 'core-js/es6/reflect';
// see issue https://github.com/AngularClass/angular2-webpack-starter/issues/709
// import 'core-js/es6/promise';

import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

// Typescript emit helpers polyfill
import 'ts-helpers';


