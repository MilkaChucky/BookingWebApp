import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RatingModel } from 'src/app/shared/models/RatingModel';
import { BaseServiceClass } from './BaseServiceClass';

@Injectable({
  providedIn: 'root'
})
export class ReviewService extends BaseServiceClass {

  constructor(private http: HttpClient) {
    super();
  }

  addReview(dto: RatingModel, hotelId: string): Observable<any> {
    const url = this.backendUrl + `bookings/hotel/${hotelId}/rating`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.post<any>(url, JSON.stringify(dto), httpOptions)
      .pipe(
        tap(_ => console.log(`[ReviewService] Adding review to: ${hotelId}`)),
        catchError(this.handleError())
      );
  }
}
