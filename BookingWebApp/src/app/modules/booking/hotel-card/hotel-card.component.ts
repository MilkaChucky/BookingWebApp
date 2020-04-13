import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { HotelService } from 'src/app/core/services/hotel.service';
import { MatSlider, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrls: ['./hotel-card.component.scss']
})
export class HotelCardComponent implements OnInit {
  @ViewChild(MatSlider , {static: false}) slider: MatSlider;
  @Input() hotel: HotelModel;

  constructor(
    private hService: HotelService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
  }

  openBookingDialog(): void {

  }

  updateScore(): void {
    if (!!this.slider) {
      this.hService.updateHotelScore(this.hotel.id, this.slider.value);
    } else {
      this.snack.open('Error while saving score. Try again later!', 'Error', {
        duration: 2000,
        politeness: 'assertive'
      });
    }
  }

}
