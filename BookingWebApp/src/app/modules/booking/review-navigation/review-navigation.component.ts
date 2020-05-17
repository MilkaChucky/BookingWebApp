import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { ReviewService } from 'src/app/core/services/review.service';
import { RatingsDto, RatingModel } from 'src/app/shared/models/RatingModel';
import { AuthenticationService } from '../../authentication/services/authentication.service';

@Component({
  selector: 'app-review-navigation',
  templateUrl: './review-navigation.component.html',
  styleUrls: ['./review-navigation.component.scss']
})
export class ReviewNavigationComponent implements OnInit {
  @ViewChild('MasterPaginator', { static: true }) masterPaginator: MatPaginator;

  displayedColumns: string[] = ['opinion', 'rating'];
  dataSource: MatTableDataSource<RatingModel>;

  rating: RatingModel;
  ratings: RatingsDto;
  hotelId: string;

  constructor(
    private rService: ReviewService,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private aService: AuthenticationService,
    public dialog: MatDialog
  ) {
    this.ratings = { average: 0, ratings: [] };
    this.rating = { rating: 0 };
  }

  async ngOnInit() {
    this.hotelId = this.route.snapshot.params.id;
    this.refreshReview();
  }

  private refreshReview() {
    this.rService.getReview(this.hotelId).subscribe((res: RatingsDto) => {
      this.ratings = res;
      if (!!this.ratings.ratings && this.ratings.ratings.length > 0) {
        const email = this.aService.getCurrentUserEmail();
        const temp = res.ratings.find(r => r.email === email);
        if (!!temp) {
          this.rating = { ...temp };
        }
      }
      this.dataSource = new MatTableDataSource<RatingModel>(this.ratings.ratings);
      this.dataSource.paginator = this.masterPaginator;
    }, err => {
      this.snack.open(err, 'Error', { duration: 2000 });
    });
  }

  submitReview() {
    this.rService.addReview(this.rating, this.hotelId).subscribe(() => {
      this.snack.open('Review saved successfully!', 'Update', { duration: 2000 });
      this.refreshReview();
    }, err => {
      this.snack.open(err, 'Error', { duration: 2000 });
    });
  }

}
