import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { HotelService } from 'src/app/core/services/hotel.service';
import { MatSlider, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { BookingModel } from 'src/app/shared/models/BookingModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrls: ['./hotel-card.component.scss']
})
export class HotelCardComponent implements OnInit {
  @ViewChild(MatSlider , {static: false}) slider: MatSlider;
  @Input() hotel: HotelModel;
  booking: BookingModel;
  readonly imagesHotelsUrl = environment.imagesHotelsUrl;

  constructor(
    private hService: HotelService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.booking = {} as BookingModel;
  }

  goToRoomNavigation(): void {
    this.router.navigate(['booking', this.hotel._id, 'rooms']);
  }

}
