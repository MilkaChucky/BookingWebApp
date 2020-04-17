import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { RoomModel } from 'src/app/shared/models/RoomModel';
import { HotelService } from 'src/app/core/services/hotel.service';

@Component({
  selector: 'app-add-room-modal',
  templateUrl: './add-room-modal.component.html',
  styleUrls: ['./add-room-modal.component.scss']
})
export class AddRoomModalComponent implements OnInit {
  roomForm: FormGroup;
  model: RoomModel;
  hotels: HotelModel[];

  constructor(
    public dialogRef: MatDialogRef<AddRoomModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { model: RoomModel },
    private snackBar: MatSnackBar,
    private hService: HotelService
  ) {
    if (!!data && !!data.model) {
      this.model = data.model;
    }
  }

  ngOnInit() {
    this.hService.getHotels().subscribe(res => {
      if (!!res) {
        this.hotels = res;
      } else {
        this.snackBar.open('Hotels are not available for selection!', 'Error', {
          duration: 2000
        });
      }
    });

    if (!!this.model) {
      this.roomForm = new FormGroup({
        hotelId: new FormControl(this.model.hotelId, [
          Validators.required
        ]),
        roomNumber: new FormControl(this.model.roomNumber, [
          Validators.required
        ]),
        beds: new FormControl(this.model.beds, [
          Validators.required
        ])
      });
    } else {
      this.model = {} as RoomModel;
      this.roomForm = new FormGroup({
        hotelId: new FormControl('', [
          Validators.required
        ]),
        roomNumber: new FormControl('', [
          Validators.required
        ]),
        beds: new FormControl('', [
          Validators.required
        ])
      });
    }
  }

  updateModelWithForm() {
    this.model.hotelId = parseInt(this.roomForm.get('hotelId').value, 10);
    this.model.roomNumber = parseInt(this.roomForm.get('roomNumber').value, 10);
    this.model.beds = parseInt(this.roomForm.get('beds').value, 10);
  }

  save() {
    this.snackBar.open('Saving...', 'Update', {
      duration: 2000
    });
    this.updateModelWithForm();
    this.dialogRef.close({ model: this.model });
  }

}
