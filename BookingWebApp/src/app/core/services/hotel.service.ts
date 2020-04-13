import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { HotelModel } from './../../shared/models/HotelModel';
import { RoomModel } from './../../shared/models/RoomModel';
import { of, Observable } from 'rxjs';

const HOTELS: HotelModel[] = [
  {id: 0, address: 'asd', name: 'Lerrington', price: 5},
  {id: 1, address: 'ges', name: 'Grand', price: 5},
  {id: 2, address: 'vsvd', name: 'Not Grand', price: 10},
  {id: 3, address: 'bs', name: '"Grander"', price: 15},
  {id: 4, address: 'sdasd', name: 'Most Grandest Grandier Grand Grandness', price: 99999}
];

const ROOMS: RoomModel[] = [
  {id: 0, hotelId: 0, beds: 5, free: true, roomNumber: 342},
  {id: 1, hotelId: 1, beds: 25, free: true, roomNumber: 3},
  {id: 2, hotelId: 1, beds: 54, free: true, roomNumber: 2},
  {id: 3, hotelId: 0, beds: 35, free: true, roomNumber: 33422},
  {id: 4, hotelId: 3, beds: 15, free: true, roomNumber: 42}
]

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  constructor(private http: HttpClient) { }

  getHotels(): Observable<HotelModel[]> {
    return of(HOTELS);
  }

  addHotel(dto: HotelModel): Observable<object> {
    return of([]);
  }

  deleteHotel(id: number): Observable<number> {
    return of(id);
  }

  getRoomsForHotel(hotelId: number) {
    const temp = [].concat(ROOMS.filter(r => r.hotelId === hotelId));
    return of(temp);
  }

  addRoom(dto: RoomModel): Observable<object> {
    return of([]);
  }

  deleteRoom(id: number): Observable<number> {
    return of(id);
  }
}