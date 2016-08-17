// check if HMR is enabled
if(module.hot) {

    // accept itself
    module.hot.accept()
}

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';

console.info('app.environment:', app.environment);
if (app.environment === 'production') {
    enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule);

