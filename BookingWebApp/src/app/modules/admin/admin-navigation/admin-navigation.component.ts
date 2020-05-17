import { Component, OnInit, ViewChild } from '@angular/core';
import { HotelService } from 'src/app/core/services/hotel.service';
import { Router } from '@angular/router';
import { RoomModel } from 'src/app/shared/models/RoomModel';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { RoomService } from 'src/app/core/services/room.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-navigation',
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.scss']
})
export class AdminNavigationComponent implements OnInit {
  @ViewChild('MasterPaginator', { static: true }) masterPaginator: MatPaginator;
  @ViewChild('DetailsPaginator', { static: true }) detailsPaginator: MatPaginator;

  displayedColumns: string[] = ['_id', 'name', 'address', 'image'];
  displayedColumnsRooms: string[] = ['_id', 'number', 'beds', 'price', 'image'];
  dataSource: MatTableDataSource<HotelModel>;
  selection: SelectionModel<HotelModel>;
  dataSourceRooms: MatTableDataSource<RoomModel>;
  rSelection: SelectionModel<RoomModel>;

  hotels: HotelModel[];
  rooms: RoomModel[];

  readonly imagesRoomsUrl = environment.imagesRoomsUrl;
  readonly imagesHotelsUrl = environment.imagesHotelsUrl;

  constructor(
    private hService: HotelService,
    private rService: RoomService,
    private router: Router,
    private snack: MatSnackBar,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.hService.getHotels().subscribe(res => {
      this.hotels = res;
      this.dataSource = new MatTableDataSource<HotelModel>(this.hotels);
      this.rooms = [];
      this.dataSourceRooms = new MatTableDataSource<RoomModel>(this.rooms);

      const initialSelection = [];
      const allowMultiSelect = false;
      this.selection = new SelectionModel<HotelModel>(allowMultiSelect, initialSelection);

      const initialRoomSelection = [];
      const allowMultiSelectRooms = false;
      this.rSelection = new SelectionModel<RoomModel>(allowMultiSelectRooms, initialRoomSelection);

      this.dataSource.paginator = this.masterPaginator;
      this.dataSourceRooms.paginator = this.detailsPaginator;
    });
  }

  async selectRow(row: HotelModel) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
      this.rooms = [];
      this.dataSourceRooms = new MatTableDataSource<RoomModel>(this.rooms);
    } else {
      this.selection.select(row);
      this.rooms = row.rooms;
      this.dataSourceRooms = new MatTableDataSource<RoomModel>(this.rooms);
    }
  }

  selectRoomRow(row: RoomModel) {
    if (this.rSelection.isSelected(row)) {
      this.rSelection.deselect(row);
    } else {
      this.rSelection.select(row);
    }
  }

  isRoomSelected(row: RoomModel) {
    if (!!row) {
      return this.rSelection.isSelected(row);
    } else {
      return false;
    }
  }

  addHotel() {
    this.router.navigate(['admin', 'add-hotel']);
  }

  editHotel() {
    if (!!!this.selection || !!!this.selection.selected || this.selection.selected.length === 0) {
      this.snack.open('Please, select a hotel to edit first!', 'Warning', { duration: 2000 });
      return;
    }
    this.router.navigate(['admin', 'edit-hotel', this.selection.selected[0]._id]);
  }

  deleteHotel() {
    if (!!!this.selection || !!!this.selection.selected || this.selection.selected.length === 0) {
      this.snack.open('Please, select one or more hotel to delete first!', 'Warning', { duration: 2000 });
      return;
    }
    const hotelId = this.selection.selected[0]._id;
    this.hService.deleteHotel(hotelId).subscribe(() => {
      this.snack.open('Deleted successfully!', 'Update', {
        duration: 2000
      });
      this.hotels = this.dataSource.data.filter(x => x._id !== hotelId);
      this.dataSource.data = this.dataSource.data.filter(x => x._id !== hotelId);
      this.selection.clear();
    }, err => {
      this.snack.open(err, 'Error', {
        duration: 2000
      });
    });
  }

  addRoom() {
    if (!!!this.selection || !!!this.selection.selected || this.selection.selected.length === 0) {
      this.snack.open('Please, select one or more hotel to add room to first!', 'Warning', { duration: 2000 });
      return;
    }
    this.router.navigate(['admin', 'add-room', {hotelId: this.selection.selected[0]._id}]);
  }

  editRoom() {
    if (!!!this.rSelection || !!!this.rSelection.selected || this.rSelection.selected.length === 0) {
      this.snack.open('Please, select a room to edit first!', 'Warning', { duration: 2000 });
      return;
    }
    this.router.navigate(['admin', 'edit-room', this.rSelection.selected[0].number, { hotelId: this.selection.selected[0]._id }]);
  }

  deleteRoom() {
    if (!!!this.rSelection || !!!this.rSelection.selected || this.rSelection.selected.length === 0) {
      this.snack.open('Please, select one or more room to delete first!', 'Warning', {
        duration: 2000
      });
      return;
    }

    const hotelId = this.selection.selected[0]._id;
    const roomNumber = this.rSelection.selected[0].number;

    this.rService.deleteRoom(hotelId, roomNumber).subscribe(() => {
      this.snack.open('Delete successful!', 'Update', {
        duration: 2000
      });
      // Refreshing Grid
      this.rooms = this.hotels.find(h => h._id === hotelId).rooms.filter(r => r.number !== roomNumber);
      this.hotels.find(h => h._id === hotelId).rooms = this.rooms;
      this.dataSource = new MatTableDataSource<HotelModel>(this.hotels);
      this.dataSourceRooms = new MatTableDataSource<RoomModel>(this.rooms);
      this.rSelection.clear();
    }, err => {
      this.snack.open(err, 'Error', {
        duration: 2000
      });
    });
  }

}
