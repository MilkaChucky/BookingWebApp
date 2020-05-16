import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { HotelModel } from './../../shared/models/HotelModel';
import { RoomModel } from './../../shared/models/RoomModel';
import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

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

  bookRooms(idList: string[]): Observable<boolean> {
    return of(true);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
