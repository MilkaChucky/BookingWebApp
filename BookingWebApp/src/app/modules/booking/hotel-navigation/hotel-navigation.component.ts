import { Component, OnInit } from '@angular/core';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { HotelService } from 'src/app/core/services/hotel.service';

@Component({
  selector: 'app-hotel-navigation',
  templateUrl: './hotel-navigation.component.html',
  styleUrls: ['./hotel-navigation.component.scss']
})
export class HotelNavigationComponent implements OnInit {
  hotels: HotelModel[];

  constructor(
    private hotelService: HotelService
  ) { }

  ngOnInit() {
    this.hotelService.getHotels().subscribe(res => {
      this.hotels = res;
    });
  }

}
