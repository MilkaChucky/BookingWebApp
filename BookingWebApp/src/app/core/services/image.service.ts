import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

}
