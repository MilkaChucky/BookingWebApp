import { Component, OnInit, ViewChild } from '@angular/core';
import { HotelService } from 'src/app/core/services/hotel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RoomModel } from 'src/app/shared/models/RoomModel';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HotelModel } from 'src/app/shared/models/HotelModel';

@Component({
  selector: 'app-admin-navigation',
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.scss']
})
export class AdminNavigationComponent implements OnInit {
  @ViewChild('MasterPaginator', { static: true }) masterPaginator: MatPaginator;
  @ViewChild('DetailsPaginator', { static: true }) detailsPaginator: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'address', 'price', 'review'];
  displayedColumnsRooms: string[] = ['id', 'roomNumber', 'beds', 'free'];
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
    private snack: MatSnackBar
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

}
