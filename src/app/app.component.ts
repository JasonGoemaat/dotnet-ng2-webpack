import { Component, OnInit } from '@angular/core';

// uncomment to use Wijmo WjInputDateTime
// import { WjInputDateTime } from 'wijmo/wijmo.angular2.input';

import { MessageService } from './services';


@Component({
    selector: 'my-app',
    // uncomment next line to use Wijmo control
    //directives: [WjInputDateTime],
    styleUrls: ['app.component.scss'],
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    message: string = "Hello, world!  I am the AppComponent";
    strings: string[];
    values: string[];
    a: number = 2;

    constructor(public messageService: MessageService) {
        this.strings = ['hello', 'world', 'from', 'AppComponent'];
    }

    ngOnInit() {
        $('#serviceMessage').text(this.messageService.getMessage()); 
        
        this.messageService.getMessageAsync()
            .delay(3000)
            .subscribe(message => {
                console.log('Got message!', message);
                $('#serviceMessage').text(message);
            });

        this.strings = _.map(this.strings, x => {
            return 'LODASH: ' + x;
        });

        this.messageService.callApi().subscribe(values => {
            console.log('/api/values returned:', values);
            this.values = values;
        })
    }
}
