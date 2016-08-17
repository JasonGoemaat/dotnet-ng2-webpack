import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";

@Injectable()
export class MessageService {
    constructor(public http: Http) {
    }

    getMessage(): string {
        return "Initial message (from MessageService)";
    }

    getMessageAsync(): Observable<string> {
        return Observable.from(["Async message (from MessageService)"]);
    }

    callApi(): Observable<string[]> {
        return this.http.get('/api/values').map(response => response.json());
    }
}