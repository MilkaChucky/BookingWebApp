import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BookingService } from 'src/app/core/services/booking.service';
import { environment } from 'src/environments/environment';
import { BookingDto, RoomBookingDto } from 'src/app/shared/models/BookingModel';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-booking-navigation',
  templateUrl: './booking-navigation.component.html',
  styleUrls: ['./booking-navigation.component.scss']
})
export class BookingNavigationComponent implements OnInit {
  @ViewChild('MasterPaginator', { static: true }) masterPaginator: MatPaginator;
  @ViewChild('DetailsPaginator', { static: true }) detailsPaginator: MatPaginator;

  displayedColumns: string[] = ['hotelname', 'hoteladdress'];
  displayedColumnsRooms: string[] = ['number', 'from', 'to', 'delete'];
  dataSource: MatTableDataSource<BookingDto>;
  selection: SelectionModel<BookingDto>;
  dataSourceRooms: MatTableDataSource<RoomBookingDto>;

  hotels: HotelModel[];
  bookings: BookingDto[];
  rooms: RoomBookingDto[];

  readonly imagesRoomsUrl = environment.imagesRoomsUrl;
  readonly imagesHotelsUrl = environment.imagesHotelsUrl;

  constructor(
    private bService: BookingService,
    private router: Router,
    private snack: MatSnackBar,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.bService.getBookings().subscribe(res => {
      this.bookings = res;
      console.log(res);

      this.dataSource = new MatTableDataSource<BookingDto>(this.bookings);
      this.rooms = [];
      this.dataSourceRooms = new MatTableDataSource<RoomBookingDto>(this.rooms);

      const initialSelection = [];
      const allowMultiSelect = false;
      this.selection = new SelectionModel<BookingDto>(allowMultiSelect, initialSelection);

      this.dataSource.paginator = this.masterPaginator;
      this.dataSourceRooms.paginator = this.detailsPaginator;
    });
  }

  async selectRow(row: BookingDto) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
      this.rooms = [];
      this.dataSourceRooms = new MatTableDataSource<RoomBookingDto>(this.rooms);
    } else {
      this.selection.select(row);
      this.rooms = row.bookedRooms;
      this.dataSourceRooms = new MatTableDataSource<RoomBookingDto>(this.rooms);
    }
  }

  deleteBooking(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: { title: 'Are you sure about deleting the selected booking?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bService.deleteBooking(id).subscribe(res => {
          this.rooms = this.rooms.filter(x => x._id !== id);
          this.dataSourceRooms = new MatTableDataSource<RoomBookingDto>(this.rooms);
          this.selection.selected[0].bookedRooms = this.rooms;
          this.snack.open('Booking deleted successfully!', 'Update', { duration: 2000 });
        }, err => {
          this.snack.open(err, 'Error', { duration: 2000 });
        });
      }
    });
  }

}
