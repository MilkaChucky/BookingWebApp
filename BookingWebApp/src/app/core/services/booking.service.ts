import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { of, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BookingModel, AddBookingDto, BookingDto } from 'src/app/shared/models/BookingModel';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  readonly backendUrl = environment.backendUrl;

  constructor(private http: HttpClient) { }

  /*
    /api/bookings GET, DELETE
    /api/bookings/:bookingId PUT, DELETE
    /api/bookings/hotel/:hotelId POST
    /api/bookings/hotel/:hotelId/rate (amit ratingre fogok nemsokára javítani majd) POST, DELETE
  */

  bookRooms(asd?: any): Observable<boolean> {
    return of(true);
  }

  getBookings(): Observable<BookingDto[]> {
    const url = this.backendUrl + `bookings`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.get<BookingDto[]>(url, httpOptions)
      .pipe(
        tap(_ => console.log('[BookingService] Fetching bookings...')),
        catchError(this.handleError<BookingDto[]>([]))
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
        tap(_ => console.log(`[BookingService] Adding booking: + ${dto}`)),
        catchError(this.handleError<AddBookingDto>({} as AddBookingDto))
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
        tap(_ => console.log(`[BookingService] Updating booking: + ${dto}`)),
        catchError(this.handleError<BookingModel>({} as BookingModel))
      );
  }

  deleteBookingsForUser(hotelId: string, userId: string): Observable<boolean> {
    const url = this.backendUrl + `bookings/${hotelId}/${userId}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.delete<boolean>(url, httpOptions)
      .pipe(
        tap(_ => console.log(`[BookingService] Deleting bookings for user, hotel (id): + ${userId} + ${hotelId}`)),
        catchError(this.handleError<boolean>(false))
      );
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
