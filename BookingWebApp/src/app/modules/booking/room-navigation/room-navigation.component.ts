import { Component, OnInit, ViewChild } from '@angular/core';
import { HotelService } from 'src/app/core/services/hotel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RoomModel } from 'src/app/shared/models/RoomModel';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { RoomService } from 'src/app/core/services/room.service';
import { BookingService } from 'src/app/core/services/booking.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

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

  constructor(
    private rService: RoomService,
    private bService: BookingService,
    private route: ActivatedRoute,
    private router: Router,
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
    } else {
      this.selection.select(row);
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

    this.bService.addBooking({ rooms: [{
      roomId: this.selection.selected[0]._id,
      from: dateFrom,
      until: dateTo
    }]}, this.hotelId).subscribe(res => {
      this.snack.open('Booking is successfull!', 'Update', {
        duration: 2000
      });
    }, err => {
      this.snack.open('Booking failed!', 'Update', {
        duration: 2000
      });
    });
  }

}
