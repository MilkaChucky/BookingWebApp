import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { of, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BookingModel, AddBookingDto, BookingDto } from 'src/app/shared/models/BookingModel';
import { RatingModel } from 'src/app/shared/models/RatingModel';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  readonly backendUrl = environment.backendUrl;

  constructor(private http: HttpClient) { }

  addReview(dto: RatingModel, hotelId: string): Observable<any> {
    const url = this.backendUrl + `bookings/hotel/${hotelId}/rating`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.post<any>(url, JSON.stringify(dto), httpOptions)
      .pipe(
        tap(_ => console.log(`[ReviewService] Adding review to: ${hotelId}`)),
        catchError(this.handleError<any>({} as any))
      );
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
