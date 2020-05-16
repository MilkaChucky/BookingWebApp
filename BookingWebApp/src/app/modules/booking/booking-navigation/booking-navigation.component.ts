import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BookingService } from 'src/app/core/services/booking.service';
import { environment } from 'src/environments/environment';
import { BookingDto, RoomBookingDto } from 'src/app/shared/models/BookingModel';
import { HotelModel } from 'src/app/shared/models/HotelModel';

@Component({
  selector: 'app-booking-navigation',
  templateUrl: './booking-navigation.component.html',
  styleUrls: ['./booking-navigation.component.scss']
})
export class BookingNavigationComponent implements OnInit {
  @ViewChild('MasterPaginator', { static: true }) masterPaginator: MatPaginator;
  @ViewChild('DetailsPaginator', { static: true }) detailsPaginator: MatPaginator;

  displayedColumns: string[] = ['hotel'];
  displayedColumnsRooms: string[] = ['number', 'from', 'to'];
  dataSource: MatTableDataSource<BookingDto>;
  selection: SelectionModel<BookingDto>;
  dataSourceRooms: MatTableDataSource<RoomBookingDto>;
  rSelection: SelectionModel<RoomBookingDto>;

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

      this.dataSource = new MatTableDataSource<BookingDto>(this.bookings);
      this.rooms = [];
      this.dataSourceRooms = new MatTableDataSource<RoomBookingDto>(this.rooms);

      const initialSelection = [];
      const allowMultiSelect = false;
      this.selection = new SelectionModel<BookingDto>(allowMultiSelect, initialSelection);

      const initialRoomSelection = [];
      const allowMultiSelectRooms = false;
      this.rSelection = new SelectionModel<RoomBookingDto>(allowMultiSelectRooms, initialRoomSelection);

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

  selectRoomRow(row: RoomBookingDto) {
    if (this.rSelection.isSelected(row)) {
      this.rSelection.deselect(row);
    } else {
      this.rSelection.select(row);
    }
  }

  isRoomSelected(row: RoomBookingDto) {
    if (!!row) {
      return this.rSelection.isSelected(row);
    } else {
      return false;
    }
  }

  deleteHotelBooking() {
    if (!!!this.selection || !!!this.selection.selected || this.selection.selected.length === 0) {
      this.snack.open('Please, select one or more hotel to delete first!', 'Warning', { duration: 2000 });
      return;
    }
    this.selection.clear();
  }

  deleteRoomBooking() {
    if (!!!this.rSelection || !!!this.rSelection.selected || this.rSelection.selected.length === 0) {
      this.snack.open('Please, select one or more room to delete first!', 'Warning', {
        duration: 2000
      });
      return;
    }
    this.rSelection.clear();
  }

}
