import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { RoomModel } from './../../shared/models/RoomModel';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseServiceClass } from './BaseServiceClass';

@Injectable({
  providedIn: 'root'
})
export class RoomService extends BaseServiceClass {

  constructor(private http: HttpClient) {
    super();
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
        catchError(this.handleError())
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
        tap(_ => console.log(`[HotelService] Fetching room for roomNumber, hotelid: ${roomNumber} + ${hotelId}`)),
        catchError(this.handleError())
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
        catchError(this.handleError())
      );
  }

  updateRoom(dto: RoomModel, hotelId: string): Observable<RoomModel> {
    const url = this.backendUrl + `hotels/${hotelId}/rooms/${dto._id}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    console.log(JSON.stringify(dto));
    return this.http.put<RoomModel>(url, JSON.stringify(dto), httpOptions)
      .pipe(
        tap(_ => console.log(`[HotelService] Updating room:\n ${JSON.stringify(dto)}`)),
        catchError(this.handleError())
      );
  }

  deleteRoom(hotelId: string, roomNumber: number): Observable<boolean> {
    const url = this.backendUrl + `hotels/${hotelId}/rooms/${roomNumber}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.delete<boolean>(url, httpOptions)
      .pipe(
        tap(_ => console.log(`[HotelService] Deleting room: + ${roomNumber}`)),
        catchError(this.handleError())
      );
  }

}
