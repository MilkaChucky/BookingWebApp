import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { HotelService } from 'src/app/core/services/hotel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from 'src/app/core/services/image.service';

@Component({
  selector: 'app-add-hotel-modal',
  templateUrl: './edit-hotel.component.html',
  styleUrls: ['./edit-hotel.component.scss']
})
export class EditHotelComponent implements OnInit {
  hotelForm: FormGroup;
  model: HotelModel;
  isPageInitialized = false;
  isNew = false;
  fileToUpload: File = null;

  constructor(
    private hService: HotelService,
    private iService: ImageService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.isNew = id === undefined;
    if (!this.isNew) {
      this.hService.getHotel(id).subscribe(res => {
        this.model = res;
        console.log('[EditHotelComponent-ngOnInit] Hotel: ', this.model);
        if (!!this.model) {
          this.hotelForm = new FormGroup({
            name: new FormControl(this.model.name, [
              Validators.required
            ]),
            address: new FormControl(this.model.address, [
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
            ])
          });
        }
        this.isPageInitialized = true;
      });
    } else {
      this.model = {} as HotelModel;
      this.hotelForm = new FormGroup({
        name: new FormControl('', [
          Validators.required
        ]),
        address: new FormControl('', [
          Validators.required
        ])
      });
      this.isPageInitialized = true;
    }
  }

  updateModelWithForm() {
    this.model.name = this.hotelForm.get('name').value;
    this.model.address = this.hotelForm.get('address').value;
  }

  save() {
    this.snackBar.open('Saving...', 'Update', {
      duration: 2000
    });
    this.updateModelWithForm();
    if (this.isNew) {
      this.hService.addHotels(this.model).subscribe(res => {
        this.snackBar.open('Saving successful!', 'Update', {
          duration: 2000
        });
        if (!!this.fileToUpload) {
          this.uploadPhoto(this.fileToUpload, res._id);
        }
        this.router.navigate(['admin']);
      }, err => {
        this.snackBar.open('Error while saving!', 'Error', {
          duration: 2000
        });
      });
    } else {
      this.hService.updateHotel(this.model).subscribe(res => {
        this.snackBar.open('Saving successful!', 'Update', {
          duration: 2000
        });
        if (!!this.fileToUpload) {
          this.uploadPhoto(this.fileToUpload, res._id);
        }
        this.router.navigate(['admin']);
      }, err => {
        this.snackBar.open('Error while saving!', 'Error', {
          duration: 2000
        });
      });
    }
  }

  uploadPhoto(file: File, id: string): void {
    this.iService.uploadHotelImage(file, id).subscribe(res => {
      this.snackBar.open('Photo upload successful!', 'Update', {
        duration: 2000
      });
    }, err => {
      this.snackBar.open('Error while uploading photo!', 'Error', {
        duration: 2000
      });
    });
  }

  cancel() {
    this.hotelForm.reset();
    this.router.navigate(['admin']);
  }

  getPhotoFile(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

}
