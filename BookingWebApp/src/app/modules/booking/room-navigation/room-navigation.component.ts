import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomModel } from 'src/app/shared/models/RoomModel';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { RoomService } from 'src/app/core/services/room.service';
import { BookingService } from 'src/app/core/services/booking.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { RoomBookingModel } from 'src/app/shared/models/BookingModel';
import { IntervalModel } from 'src/app/shared/models/IntervalModel';

@Component({
  selector: 'app-room-navigation',
  templateUrl: './room-navigation.component.html',
  styleUrls: ['./room-navigation.component.scss']
})
export class RoomNavigationComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns: string[] = ['roomNumber', 'beds', 'price', 'images'];
  dataSource: MatTableDataSource<RoomModel>;
  selection: SelectionModel<RoomModel>;

  rooms: RoomModel[];
  hotels: HotelModel[];

  bookingForm: FormGroup;
  isPageInitialized: boolean;
  readonly imagesRoomsUrl = environment.imagesRoomsUrl;

  hotelId: string;
  readonly today: Date = new Date();
  
  private bookedIntervals = new Map<string, IntervalModel[]>();
  private get mergedIntervals(): IntervalModel[] {
    return [].concat(...Array.from(this.bookedIntervals.values()))
  }

  dateFilter = (date: Date): boolean => {
    return !this.mergedIntervals.some(i => i.from <= date && date <= i.until);
  }

  fromDateFilter = (date: Date): boolean => {
    const dateTo = this.bookingForm.get('to').value;
    const mIntervals = this.mergedIntervals;
    const minDate = dateTo && mIntervals.length && new Date(
      Math.min.apply(
        null,
        mIntervals
          .map(i => i.until)
          .filter(until => until < dateTo)
      )
    );
    return this.dateFilter(date) && (!dateTo || (date < dateTo && date > minDate))
  }

  toDateFilter = (date: Date): boolean => {
    const dateFrom = this.bookingForm.get('from').value;
    const mIntervals = this.mergedIntervals;
    const maxDate = dateFrom && mIntervals.length && new Date(
      Math.max.apply(
        null,
        mIntervals
          .map(i => i.from)
          .filter(from => from > dateFrom)
      )
    );
    return this.dateFilter(date) && (!dateFrom || date > dateFrom) && (!maxDate || date < maxDate)
  }

  constructor(
    private rService: RoomService,
    private bService: BookingService,
    private route: ActivatedRoute,
    private snack: MatSnackBar
  ) { }

  async ngOnInit() {
    this.hotelId = this.route.snapshot.params.id;
    this.rService.getRooms(this.hotelId).subscribe((res: RoomModel[]) => {
      this.rooms = res;
      this.dataSource = new MatTableDataSource<RoomModel>(this.rooms);

      const initialSelection = [];
      const allowMultiSelect = true;
      this.selection = new SelectionModel<RoomModel>(allowMultiSelect, initialSelection);

      this.dataSource.paginator = this.paginator;

      this.bookingForm = new FormGroup({
        from: new FormControl('', [
          Validators.required
        ]),
        to: new FormControl('', [
          Validators.required
        ])
      });

      this.isPageInitialized = true;
    });
  }

  selectRow(row: RoomModel) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
      this.bookedIntervals.delete(row._id);
    } else {
      this.selection.select(row);
      this.bookingForm.get('from').setValue(null);
      this.bookingForm.get('to').setValue(null);
      this.bService.getBookedIntervals(row._id).subscribe(intervals => {
        this.bookedIntervals.set(row._id, intervals);
      });
    }
  }

  bookRoom() {
    if (this.selection === undefined || this.selection.selected.length === 0) {
      this.snack.open('Please, first select a room to book!', 'Error', {
        duration: 2000
      });
      return;
    }
    if (this.bookingForm.invalid) {
      this.snack.open('Please, select begin and end date first!', 'Error', {
        duration: 2000
      });
      return;
    }

    const dateFrom = this.bookingForm.get('from').value;
    const dateTo = this.bookingForm.get('to').value;

    const roomBookings: RoomBookingModel[] = [];
    this.selection.selected.forEach(r => {
      roomBookings.push({
        roomId: r._id,
        from: dateFrom,
        until: dateTo
      });
    });

    this.bService.addBooking({ rooms: roomBookings }, this.hotelId).subscribe(() => {
      this.snack.open('Booking is successfull! Informational email about the booking is sent to you!', 'Update', {
        duration: 2000
      });
      this.selection.clear();
    }, err => {
        this.snack.open(err, 'Error', {
        duration: 2000
      });
    });
  }

}
