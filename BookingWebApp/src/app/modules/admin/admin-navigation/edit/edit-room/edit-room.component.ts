import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { RoomModel } from 'src/app/shared/models/RoomModel';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { RoomService } from 'src/app/core/services/room.service';
import { ImageService } from 'src/app/core/services/image.service';

@Component({
  selector: 'app-add-room-modal',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.scss']
})
export class EditRoomComponent implements OnInit {
  roomForm: FormGroup;
  model: RoomModel;
  hotels: HotelModel[];
  isNew = false;
  hotelId: string;
  fileToUpload: File = null;
  isPageInitialized: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private rService: RoomService,
    private iService: ImageService
  ) {}

  ngOnInit() {
    this.isNew = this.route.snapshot.params.id === undefined;
    this.hotelId = this.route.snapshot.params.hotelId;

    if (!!this.model) {
      this.roomForm = new FormGroup({
        number: new FormControl(this.model.number, [
          Validators.required
        ]),
        beds: new FormControl(this.model.beds, [
          Validators.required
        ]),
        price: new FormControl(this.model.price, [
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
        ]),
        price: new FormControl('', [
          Validators.required
        ])
      });
    }

    this.isPageInitialized = true;
  }

  updateModelWithForm() {
    this.model.number = parseInt(this.roomForm.get('number').value, 10);
    this.model.beds = parseInt(this.roomForm.get('beds').value, 10);
    this.model.price = parseInt(this.roomForm.get('price').value, 10);
  }

  save() {
    this.snackBar.open('Saving...', 'Update', {
      duration: 2000
    });
    this.updateModelWithForm();
    if (this.isNew) {
      this.rService.addRoom(this.model, this.hotelId).subscribe(res => {
        this.snackBar.open('Save successful!', 'Update', {
          duration: 2000
        });
        if (!!this.fileToUpload) {
          this.uploadRoomPhoto(this.fileToUpload, this.model.number);
        }
        this.router.navigate(['admin']);
      }, err => {
        this.snackBar.open('Error while saving!', 'Error', {
          duration: 2000
        });
      });
    } else {
      this.rService.updateRoom(this.model, this.hotelId).subscribe(res => {
        this.snackBar.open('Save successful!', 'Update', {
          duration: 2000
        });
        if (!!this.fileToUpload) {
          this.uploadRoomPhoto(this.fileToUpload, this.model.number);
        }
        this.router.navigate(['admin']);
      }, err => {
        this.snackBar.open('Error while saving!', 'Error', {
          duration: 2000
        });
      });
    }
  }

  getPhotoFile(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  uploadRoomPhoto(file: File, roomNumber: number): void {
    this.iService.uploadRoomImage(file, roomNumber).subscribe(res => {
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
    this.roomForm.reset();
    this.router.navigate(['admin']);
  }

}
