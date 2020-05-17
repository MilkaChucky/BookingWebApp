import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BaseServiceClass {
    readonly backendUrl = environment.backendUrl;

    constructor() { }

    protected handleError() {
        return (error: any): Observable<any> => {
            console.error(error);
            return throwError(error.error.message);
        };
    }
}
