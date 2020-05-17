import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { MatSlider } from '@angular/material';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ReviewService } from 'src/app/core/services/review.service';

@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrls: ['./hotel-card.component.scss']
})
export class HotelCardComponent implements OnInit {
  @ViewChild(MatSlider , {static: false}) slider: MatSlider;
  @Input() hotel: HotelModel;
  readonly imagesHotelsUrl = environment.imagesHotelsUrl;
  average: number;

  constructor(
    private rService: ReviewService,
    private router: Router
  ) {
    this.average = 0;
  }

  async ngOnInit() {
    this.rService.getReview(this.hotel._id).subscribe(res => {
      if (res.average !== undefined && res.average !== null) {
        this.average = res.average;
      }
    });
  }

  goToRoomNavigation(): void {
    this.router.navigate(['hotels', this.hotel._id, 'rooms']);
  }

  goToReviews(): void {
    this.router.navigate(['hotels', this.hotel._id, 'reviews']);
  }

}
