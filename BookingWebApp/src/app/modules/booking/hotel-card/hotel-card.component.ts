import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { HotelService } from 'src/app/core/services/hotel.service';
import { MatSlider, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { BookingModel } from 'src/app/shared/models/BookingModel';
import { environment } from 'src/environments/environment';
import { RatingModel } from 'src/app/shared/models/RatingModel';
import { ReviewService } from 'src/app/core/services/review.service';

@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrls: ['./hotel-card.component.scss']
})
export class HotelCardComponent implements OnInit {
  @ViewChild(MatSlider , {static: false}) slider: MatSlider;
  @Input() hotel: HotelModel;
  rating: RatingModel;
  readonly imagesHotelsUrl = environment.imagesHotelsUrl;

  constructor(
    private hService: HotelService,
    private rService: ReviewService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.rating = {rating: 0} as RatingModel;
  }

  goToRoomNavigation(): void {
    this.router.navigate(['hotels', this.hotel._id, 'rooms']);
  }

  submitReview() {
    this.rService.addReview(this.rating, this.hotel._id).subscribe( res => {
      this.snack.open('Review saved successfully!', 'Update', { duration: 2000 });
    }, err => {
      this.snack.open('Error while saving review!', 'Error', { duration: 2000 });
    });
  }

}
