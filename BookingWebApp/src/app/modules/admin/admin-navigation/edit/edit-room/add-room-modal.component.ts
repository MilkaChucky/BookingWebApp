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
  isNew = false;
  hotelId: string;
  fileToUpload: File = null;

  constructor(
    public dialogRef: MatDialogRef<AddRoomModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { model: RoomModel },
    private snackBar: MatSnackBar,
    private hService: HotelService
  ) {
    if (!!data && !!data.model) {
      this.model = data.model;
    } else {
      this.isNew = true;
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
        number: new FormControl(this.model.number, [
          Validators.required
        ]),
        beds: new FormControl(this.model.beds, [
          Validators.required
        ])
      });
    } else {
      this.model = {} as RoomModel;
      this.roomForm = new FormGroup({
        number: new FormControl('', [
          Validators.required
        ]),
        beds: new FormControl('', [
          Validators.required
        ])
      });
    }
  }

  updateModelWithForm() {
    this.model.number = parseInt(this.roomForm.get('number').value, 10);
    this.model.beds = parseInt(this.roomForm.get('beds').value, 10);
  }

  save() {
    this.snackBar.open('Saving...', 'Update', {
      duration: 2000
    });
    this.updateModelWithForm();
    this.dialogRef.close({
      model: this.model,
      photo: this.fileToUpload
    });
  }

  uploadPhoto(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

}
