import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseServiceClass } from './BaseServiceClass';

@Injectable({
  providedIn: 'root'
})
export class ImageService extends BaseServiceClass {

  constructor(private http: HttpClient) {
    super();
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
        catchError(this.handleError())
      );
  }

  uploadRoomImage(photo: File, hotelId: string, roomNumber: number): Observable<boolean> {
    const url = this.backendUrl + 'hotels/' + hotelId + '/rooms/' + roomNumber + '/images';
    const httpOptions = {
      withCredentials: true
    };
    const formData: FormData = new FormData();
    formData.append('file', photo, photo.name);
    return this.http.post<boolean>(url, formData, httpOptions)
      .pipe(
        catchError(this.handleError())
      );
  }

  deleteHotelImage(photos: string[], id: string): Observable<boolean> {
    const url = this.backendUrl + 'hotels/' + id + '/images/delete';
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.post<boolean>(url, JSON.stringify(photos), httpOptions)
      .pipe(
        catchError(this.handleError())
      );
  }

  deleteRoomImage(photos: string[], hotelId: string, roomNumber: number): Observable<boolean> {
    const url = this.backendUrl + 'hotels/' + hotelId + '/rooms/' + roomNumber + '/images/delete';
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    return this.http.post<boolean>(url, JSON.stringify(photos), httpOptions)
      .pipe(
        catchError(this.handleError())
      );
  }

}
