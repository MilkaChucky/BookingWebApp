import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { RoomModel } from './../../shared/models/RoomModel';
import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  readonly backendUrl = environment.backendUrl;

  constructor(private http: HttpClient) { }

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

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
