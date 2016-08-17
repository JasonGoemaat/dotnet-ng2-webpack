// check if HMR is enabled
if(module.hot) {

    // accept itself
    module.hot.accept()
}

// libs
require('script!../node_modules/jquery/dist/jquery.min.js');
require('script!../node_modules/lodash/lodash.min.js');

// polyfills
import 'core-js';
import 'reflect-metadata';
import 'zone.js/dist/zone';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';

console.info('app.environment:', app.environment);
if (app.environment === 'production') {
    enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule);

