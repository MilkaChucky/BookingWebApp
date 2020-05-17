import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { ReviewService } from 'src/app/core/services/review.service';
import { RatingsDto, RatingModel } from 'src/app/shared/models/RatingModel';

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
  ratings: RatingsDto[];
  hotelId: string;

  constructor(
    private rService: ReviewService,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.hotelId = this.route.snapshot.params.id;
    this.rService.getReview(this.hotelId).subscribe((res: RatingsDto) => {
      if (!!res.ratings[0]) {
        this.rating = res.ratings[0];
      }
      this.dataSource = new MatTableDataSource<RatingModel>(res.ratings);
      this.dataSource.paginator = this.masterPaginator;
    }, err => {
      this.snack.open(err, 'Error', { duration: 2000 });
    });
  }

  submitReview() {
    this.rService.addReview(this.rating, this.hotelId).subscribe(() => {
      this.snack.open('Review saved successfully!', 'Update', { duration: 2000 });
    }, err => {
      this.snack.open(err, 'Error', { duration: 2000 });
    });
  }

}
