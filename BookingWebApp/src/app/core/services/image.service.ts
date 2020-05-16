import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { of, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  readonly backendUrl = environment.backendUrl;

  constructor(private http: HttpClient) { }

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
        catchError(this.handleError<boolean>(false))
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
        tap(_ => console.log(`[HotelService] Uploading photo for room: (roomNumber, photo): + ${roomNumber} + ${photo}`)),
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
