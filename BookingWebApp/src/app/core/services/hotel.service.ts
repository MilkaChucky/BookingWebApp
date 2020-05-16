import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { HotelModel } from './../../shared/models/HotelModel';
import { RoomModel } from './../../shared/models/RoomModel';
import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BookingModel } from 'src/app/shared/models/BookingModel';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  readonly backendUrl = environment.backendUrl;

  constructor(private http: HttpClient) { }

  getHotels(): Observable<HotelModel[]> {
    const url = this.backendUrl + 'hotels';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      withCredentials: true
    };
    return this.http.get<HotelModel[]>(url, httpOptions)
      .pipe(
        tap(_ => console.log('[HotelService] Fetching hotels...')),
        catchError(this.handleError<HotelModel[]>('getHotels', []))
      );
  }

  getHotel(id: string): Observable<HotelModel> {
    const url = this.backendUrl + 'hotels/' + id;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.get<HotelModel>(url, httpOptions)
      .pipe(
        tap(_ => console.log(`[HotelService] Fetching hotel for id: + ${id}`)),
        catchError(this.handleError<HotelModel>('getHotel', {} as HotelModel))
      );
  }

  addHotels(dto: HotelModel): Observable<HotelModel> {
    const url = this.backendUrl + 'hotels';
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.post<HotelModel>(url, JSON.stringify(dto), httpOptions)
      .pipe(
        tap(_ => console.log(`[HotelService] Adding hotel: + ${dto}`)),
        catchError(this.handleError<HotelModel>('addHotels', {} as HotelModel))
      );
  }

  updateHotel(dto: HotelModel): Observable<HotelModel> {
    const url = this.backendUrl + 'hotels/' + dto._id;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.put<HotelModel>(url, JSON.stringify(dto), httpOptions)
      .pipe(
        tap(_ => console.log(`[HotelService] Updating hotel: + ${dto}`)),
        catchError(this.handleError<HotelModel>('updateHotel', {} as HotelModel))
      );
  }

  deleteHotel(id: string): Observable<HotelModel> {
    const url = this.backendUrl + 'hotels/' + id;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.delete<HotelModel>(url, httpOptions)
      .pipe(
        tap(_ => console.log(`[HotelService] Deleting hotel (id): + ${id}`)),
        catchError(this.handleError<HotelModel>('deleteHotel', {} as HotelModel))
      );
  }

  uploadHotelImage(photo: File, id: string): Observable<boolean> {
    const url = this.backendUrl + 'hotels/' + id + '/images';
    const httpOptions = {
      withCredentials: true
    };
    const formData: FormData = new FormData();
    formData.append('file', photo, photo.name);
    return this.http.post<boolean>(url, formData, httpOptions)
      .pipe(
        tap(_ => console.log(`[HotelService] Uploading photo for hotel: (hotel id, photo): + ${id} + ${photo}`)),
        catchError(this.handleError<boolean>('uploadHotelImage', false))
      );
  }

  uploadRoomImage(photo: File, roomNumber: number): Observable<boolean> {
    const url = this.backendUrl + 'rooms/' + roomNumber + '/images';
    const httpOptions = {
      withCredentials: true
    };
    const formData: FormData = new FormData();
    formData.append('file', photo, photo.name);
    return this.http.post<boolean>(url, formData, httpOptions)
      .pipe(
        tap(_ => console.log(`[HotelService] Uploading photo for room: (roomNumber, photo): + ${roomNumber} + ${photo}`)),
        catchError(this.handleError<boolean>('uploadRoomImage', false))
      );
  }

  getRooms(hotelId: string): Observable<RoomModel[]> {
    const url = this.backendUrl + `hotels/${hotelId}/rooms`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.get<RoomModel[]>(url, httpOptions)
      .pipe(
        tap(_ => console.log('[HotelService] Fetching rooms...')),
        catchError(this.handleError<RoomModel[]>('getRooms', []))
      );
  }

  getRoom(hotelId: string, roomNumber: number): Observable<RoomModel> {
    const url = this.backendUrl + `hotels/${hotelId}/rooms/${roomNumber}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.get<RoomModel>(url, httpOptions)
      .pipe(
        tap(_ => console.log(`[HotelService] Fetching room for roomNumber: + ${roomNumber}`)),
        catchError(this.handleError<RoomModel>('getRoom', {} as RoomModel))
      );
  }

  addRoom(dto: RoomModel, hotelId: string): Observable<RoomModel> {
    const url = this.backendUrl + `hotels/${hotelId}/rooms`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.post<RoomModel>(url, JSON.stringify(dto), httpOptions)
      .pipe(
        tap(_ => console.log(`[HotelService] Adding room: + ${dto}`)),
        catchError(this.handleError<RoomModel>('addRoom', {} as RoomModel))
      );
  }

  updateRoom(dto: RoomModel, hotelId: string): Observable<RoomModel> {
    const url = this.backendUrl + `hotels/${hotelId}/rooms/${dto._id}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.put<RoomModel>(url, JSON.stringify(dto), httpOptions)
      .pipe(
        tap(_ => console.log(`[HotelService] Updating room: + ${dto}`)),
        catchError(this.handleError<RoomModel>('updateRoom', {} as RoomModel))
      );
  }

  deleteRoom(hotelId: string, id: string): Observable<boolean> {
    const url = this.backendUrl + `hotels/${hotelId}/rooms/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.delete<boolean>(url, httpOptions)
      .pipe(
        tap(_ => console.log(`[HotelService] Deleting room (id): + ${id}`)),
        catchError(this.handleError<boolean>('deleteRoom', false))
      );
  }

  /*
    /api/bookings GET, DELETE
    /api/bookings/:bookingId PUT, DELETE
    /api/bookings/hotel/:hotelId POST
    /api/bookings/hotel/:hotelId/rate (amit ratingre fogok nemsokára javítani majd) POST, DELETE
  */

  bookRooms(idList: string[]): Observable<boolean> {
    return of(true);
  }

  getBookings(): Observable<BookingModel[]> {
    const url = this.backendUrl + `bookings`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.get<BookingModel[]>(url, httpOptions)
      .pipe(
        tap(_ => console.log('[HotelService] Fetching bookings...')),
        catchError(this.handleError<BookingModel[]>('getBookings', []))
      );
  }

  addBooking(dto: BookingModel, hotelId: string): Observable<BookingModel> {
    const url = this.backendUrl + `bookings/hotel/${hotelId}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.post<BookingModel>(url, JSON.stringify(dto), httpOptions)
      .pipe(
        tap(_ => console.log(`[HotelService] Adding booking: + ${dto}`)),
        catchError(this.handleError<BookingModel>('addBooking', {} as BookingModel))
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
        tap(_ => console.log(`[HotelService] Updating booking: + ${dto}`)),
        catchError(this.handleError<BookingModel>('updateBooking', {} as BookingModel))
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
        tap(_ => console.log(`[HotelService] Deleting bookings for user, hotel (id): + ${userId} + ${hotelId}`)),
        catchError(this.handleError<boolean>('deleteBookingsForUser', false))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
