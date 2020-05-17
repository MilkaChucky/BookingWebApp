import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HotelModel } from './../../shared/models/HotelModel';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseServiceClass } from './BaseServiceClass';

@Injectable({
  providedIn: 'root'
})
export class HotelService extends BaseServiceClass {

  constructor(private http: HttpClient) {
    super();
  }

  getHotels(): Observable<HotelModel[]> {
    const url = this.backendUrl + 'hotels';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      withCredentials: true
    };
    return this.http.get<HotelModel[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError())
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
        catchError(this.handleError())
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
        catchError(this.handleError())
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
        catchError(this.handleError())
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
        catchError(this.handleError())
      );
  }

}
