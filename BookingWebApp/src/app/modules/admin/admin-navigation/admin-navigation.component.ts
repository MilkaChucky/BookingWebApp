import { Component, OnInit, ViewChild } from '@angular/core';
import { HotelService } from 'src/app/core/services/hotel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RoomModel } from 'src/app/shared/models/RoomModel';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { AddHotelModalComponent } from './modals/add-hotel-modal/add-hotel-modal.component';
import { AddRoomModalComponent } from './modals/add-room-modal/add-room-modal.component';

@Component({
  selector: 'app-admin-navigation',
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.scss']
})
export class AdminNavigationComponent implements OnInit {
  @ViewChild('MasterPaginator', { static: true }) masterPaginator: MatPaginator;
  @ViewChild('DetailsPaginator', { static: true }) detailsPaginator: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'address', 'price', 'review'];
  displayedColumnsRooms: string[] = ['id', 'hotelId', 'roomNumber', 'beds', 'free'];
  dataSource: MatTableDataSource<HotelModel>;
  selection: SelectionModel<HotelModel>;
  dataSourceRooms: MatTableDataSource<RoomModel>;
  rSelection: SelectionModel<RoomModel>;

  hotels: HotelModel[];
  rooms: RoomModel[];

  constructor(
    private hService: HotelService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.hService.getHotels().subscribe(res => {
      if (!!res) {
        this.hotels = res;
        this.dataSource = new MatTableDataSource<HotelModel>(this.hotels);
      } else {
        this.dataSource = new MatTableDataSource<HotelModel>([]);
      }
    });
    this.rooms = [];
    this.dataSourceRooms = new MatTableDataSource<RoomModel>(this.rooms);

    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<HotelModel>(allowMultiSelect, initialSelection);

    const initialRoomSelection = [];
    const allowMultiSelectRooms = true;
    this.rSelection = new SelectionModel<RoomModel>(allowMultiSelectRooms, initialRoomSelection);

    this.dataSource.paginator = this.masterPaginator;
    this.dataSourceRooms.paginator = this.detailsPaginator;
  }

  async selectRow(row: HotelModel) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
      this.hService.getRoomsForHotel(row.id).subscribe(res => {
        if (!!res && res.length > 0) {
          this.rooms = [].concat(this.rooms.filter(r => r.hotelId !== row.id));
          this.dataSourceRooms = new MatTableDataSource<RoomModel>(this.rooms);
        }
      });
    } else {
      this.selection.select(row);
      this.hService.getRoomsForHotel(row.id).subscribe(res => {
        if (!!res && res.length > 0) {
          this.rooms = this.rooms.concat(res);
          this.dataSourceRooms = new MatTableDataSource<RoomModel>(this.rooms);
        }
      });
    }
  }

  selectRoomRow(row: RoomModel) {
    if (row.free) {
      if (this.rSelection.isSelected(row)) {
        this.rSelection.deselect(row);
      } else {
        this.rSelection.select(row);
      }
    } else {
      this.snack.open('Only free rooms can be selected!', 'Warning', {
        duration: 2000
      });
    }
  }

  isRoomSelected(row: RoomModel) {
    if (!!row) {
      return this.rSelection.isSelected(row);
    } else {
      return false;
    }
  }

  bookRoom() {
    if (this.selection === undefined || this.selection.selected.length === 0) {
      this.snack.open('Error while saving!', 'Error', {
        duration: 2000
      });
      return;
    }
    const idList = [];
    this.selection.selected.forEach(r => {
      idList.push(r.id);
    });
    this.hService.bookRooms(idList).subscribe(res => {
      if (!!res) {
        this.snack.open('Saved successfully!', 'Update', {
          duration: 2000
        });
      } else {
        this.snack.open('Error while saving!', 'Error', {
          duration: 2000
        });
      }
    });
  }

  addHotel() {
    const dialogRef = this.dialog.open(AddHotelModalComponent, {
      width: '500px',
      panelClass: 'ghost-dialog-white',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: {model: HotelModel}) => {
      if (!!result && !!result.model) {
        this.hService.addHotel(result.model).subscribe( res => {
          if (!!res) {
            this.snack.open('Save successful!', 'Update', {
              duration: 2000
            });
          } else {
            this.snack.open('Error while saving!', 'Error', {
              duration: 2000
            });
          }
        });
      }
    });
  }

  editHotel() {
    if (!!!this.selection || !!!this.selection.selected || this.selection.selected.length === 0) {
      this.snack.open('Please, select a hotel to edit first!', 'Warning', {
        duration: 2000
      });
      return;
    }

    const dialogRef = this.dialog.open(AddHotelModalComponent, {
      width: '500px',
      panelClass: 'ghost-dialog-white',
      data: {model: this.selection.selected[0]}
    });

    dialogRef.afterClosed().subscribe((result: { model: HotelModel }) => {
      if (!!result && !!result.model) {
        this.hService.updateHotel(result.model).subscribe(res => {
          if (!!res) {
            this.snack.open('Save successful!', 'Update', {
              duration: 2000
            });
          } else {
            this.snack.open('Error while saving!', 'Error', {
              duration: 2000
            });
          }
        });
      }
    });
  }

  deleteHotel() {
    if (!!!this.selection || !!!this.selection.selected || this.selection.selected.length === 0) {
      this.snack.open('Please, select one or more hotel to delete first!', 'Warning', {
        duration: 2000
      });
      return;
    }

    const idsToDelete = [];
    this.selection.selected.forEach(h => {
      idsToDelete.push(h.id);
    });

    this.selection.clear();

    this.hService.deleteHotel(idsToDelete).subscribe(res => {
      if (!!res) {
        this.snack.open('Deleted successfully!', 'Update', {
          duration: 2000
        });
      } else {
        this.snack.open('Error while deleting!', 'Error', {
          duration: 2000
        });
      }
    });
  }

  addRoom() {
    const dialogRef = this.dialog.open(AddRoomModalComponent, {
      width: '500px',
      panelClass: 'ghost-dialog-white',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: { model: RoomModel }) => {
      if (!!result && !!result.model) {
        this.hService.addRoom(result.model).subscribe(res => {
          if (!!res) {
            this.snack.open('Save successful!', 'Update', {
              duration: 2000
            });
          } else {
            this.snack.open('Error while saving!', 'Error', {
              duration: 2000
            });
          }
        });
      }
    });
  }

  editRoom() {
    if (!!!this.rSelection || !!!this.rSelection.selected || this.rSelection.selected.length === 0) {
      this.snack.open('Please, select a room to edit first!', 'Warning', {
        duration: 2000
      });
      return;
    }

    const dialogRef = this.dialog.open(AddRoomModalComponent, {
      width: '500px',
      panelClass: 'ghost-dialog-white',
      data: { model: this.rSelection.selected[0]}
    });

    dialogRef.afterClosed().subscribe((result: { model: RoomModel }) => {
      if (!!result && !!result.model) {
        this.hService.addRoom(result.model).subscribe(res => {
          if (!!res) {
            this.snack.open('Save successful!', 'Update', {
              duration: 2000
            });
          } else {
            this.snack.open('Error while saving!', 'Error', {
              duration: 2000
            });
          }
        });
      }
    });
  }

  deleteRoom() {
    if (!!!this.rSelection || !!!this.rSelection.selected || this.rSelection.selected.length === 0) {
      this.snack.open('Please, select one or more room to delete first!', 'Warning', {
        duration: 2000
      });
      return;
    }

    const idsToDelete = [];
    this.selection.selected.forEach(h => {
      idsToDelete.push(h.id);
    });

    this.selection.clear();

    this.hService.deleteRoom(idsToDelete).subscribe(res => {
      if (!!res) {
        this.snack.open('Deleted successfully!', 'Update', {
          duration: 2000
        });
      } else {
        this.snack.open('Error while deleting!', 'Error', {
          duration: 2000
        });
      }
    });
  }
}
