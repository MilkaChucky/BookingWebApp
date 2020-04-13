import { Component, OnInit, ViewChild } from '@angular/core';
import { HotelService } from 'src/app/core/services/hotel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RoomModel } from 'src/app/shared/models/RoomModel';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-room-navigation',
  templateUrl: './room-navigation.component.html',
  styleUrls: ['./room-navigation.component.scss']
})
export class RoomNavigationComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns: string[] = ['roomNumber', 'beds', 'free'];
  dataSource: MatTableDataSource<RoomModel>;
  selection: SelectionModel<RoomModel>;

  rooms: RoomModel[];

  constructor(
    private hService: HotelService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) { }

  async ngOnInit() {
    const id = parseInt(this.route.snapshot.params.id, 10);
    this.hService.getRoomsForHotel(id).subscribe( res => {
      if (!!res) {
        this.rooms = res;
        this.dataSource = new MatTableDataSource<RoomModel>(this.rooms);
      } else {
        this.dataSource = new MatTableDataSource<RoomModel>([]);
      }
    });

    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<RoomModel>(allowMultiSelect, initialSelection);

    this.dataSource.paginator = this.paginator;
  }

  selectRow(row: RoomModel) {
    if (row.free) {
      if (this.selection.isSelected(row)) {
        this.selection.deselect(row);
      } else {
        this.selection.select(row);
      }
    } else {
      this.snack.open('Only free rooms can be selected!', 'Warning', {
        duration: 2000
      });
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
