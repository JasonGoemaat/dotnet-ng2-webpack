import { NgModule, OnInit } from '@angular/core';
import { Http, HTTP_PROVIDERS } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MessageService } from './services'

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule],
    bootstrap: [AppComponent],
    providers: [
        Http, HTTP_PROVIDERS,
        MessageService
    ]
})
export class AppModule{
}
