import { Component, Input, ViewChild } from '@angular/core';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { MatSlider } from '@angular/material';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrls: ['./hotel-card.component.scss']
})
export class HotelCardComponent {
  @ViewChild(MatSlider , {static: false}) slider: MatSlider;
  @Input() hotel: HotelModel;
  readonly imagesHotelsUrl = environment.imagesHotelsUrl;

  constructor(
    private router: Router
  ) {}

  goToRoomNavigation(): void {
    this.router.navigate(['hotels', this.hotel._id, 'rooms']);
  }

  goToReviews(): void {
    this.router.navigate(['hotels', this.hotel._id, 'reviews']);
  }

}
