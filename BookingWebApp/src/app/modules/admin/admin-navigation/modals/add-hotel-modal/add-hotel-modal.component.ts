import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HotelModel } from 'src/app/shared/models/HotelModel';

@Component({
  selector: 'app-add-hotel-modal',
  templateUrl: './add-hotel-modal.component.html',
  styleUrls: ['./add-hotel-modal.component.scss']
})
export class AddHotelModalComponent implements OnInit {
  hotelForm: FormGroup;
  model: HotelModel;

  constructor(
    public dialogRef: MatDialogRef<AddHotelModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {model: HotelModel},
    private snackBar: MatSnackBar
  ) {
    if (!!data && !!data.model) {
      this.model = data.model;
    }
  }

  ngOnInit() {
    if (!!this.model) {
      this.hotelForm = new FormGroup({
        name: new FormControl(this.model.name, [
          Validators.required
        ]),
        address: new FormControl(this.model.address, [
          Validators.required
        ]),
        price: new FormControl(this.model.price, [
          Validators.required
        ])
      });
    } else {
      this.model = {} as HotelModel;
      this.hotelForm = new FormGroup({
        name: new FormControl('', [
          Validators.required
        ]),
        address: new FormControl('', [
          Validators.required
        ]),
        price: new FormControl('', [
          Validators.required
        ])
      });
    }
  }

  updateModelWithForm() {
    this.model.name = this.hotelForm.get('name').value;
    this.model.address = this.hotelForm.get('name').value;
    this.model.price = parseInt(this.hotelForm.get('name').value, 10);
  }

  save() {
    this.snackBar.open('Saving...', 'Update', {
      duration: 2000
    });
    this.updateModelWithForm();
    this.dialogRef.close({model: this.model});
  }

}
