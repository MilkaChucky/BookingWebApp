import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { BookingModel, AddBookingDto, BookingDto } from 'src/app/shared/models/BookingModel';
import { IntervalModel } from 'src/app/shared/models/IntervalModel';
import { BaseServiceClass } from './BaseServiceClass';

@Injectable({
  providedIn: 'root'
})
export class BookingService extends BaseServiceClass {

  constructor(private http: HttpClient) {
    super();
  }

  getBookings(): Observable<BookingDto[]> {
    const url = this.backendUrl + `bookings`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.get<BookingDto[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError())
      );
  }

  addBooking(dto: AddBookingDto, hotelId: string): Observable<AddBookingDto> {
    const url = this.backendUrl + `bookings/hotel/${hotelId}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.post<AddBookingDto>(url, JSON.stringify(dto), httpOptions)
      .pipe(
        catchError(this.handleError())
      );
  }

  updateBooking(dto: BookingModel): Observable<BookingModel> {
    const url = this.backendUrl + `bookings/${dto._id}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.put<BookingModel>(url, JSON.stringify(dto), httpOptions)
      .pipe(
        catchError(this.handleError())
      );
  }

  deleteBooking(bookingId: string): Observable<boolean> {
    const url = this.backendUrl + `bookings/${bookingId}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.delete<boolean>(url, httpOptions)
      .pipe(
        catchError(this.handleError())
      );
  }

  getBookedIntervals(roomId: string): Observable<IntervalModel[]> {
    const url = this.backendUrl + `bookings/room/${roomId}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.get<IntervalModel[]>(url, httpOptions)
      .pipe(
        map(intervals => intervals.map(i => {
          const from = new Date(i.from);
          const until = new Date(i.until);

          from.setHours(0,0,0,0);
          until.setHours(0,0,0,0);

          return { from: from, until: until }
        })),
        catchError(this.handleError())
      );
  }
}
