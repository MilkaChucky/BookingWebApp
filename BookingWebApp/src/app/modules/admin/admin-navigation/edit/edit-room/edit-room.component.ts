import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotelModel } from 'src/app/shared/models/HotelModel';
import { RoomModel } from 'src/app/shared/models/RoomModel';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatTableDataSource, MatDialog } from '@angular/material';
import { RoomService } from 'src/app/core/services/room.service';
import { ImageService } from 'src/app/core/services/image.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

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
  dataSource: MatTableDataSource<string>;

  readonly imagesRoomsUrl = environment.imagesRoomsUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private rService: RoomService,
    private iService: ImageService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    const roomNumber = parseInt(this.route.snapshot.params.id, 10);
    this.isNew = this.route.snapshot.params.id === undefined;
    this.hotelId = this.route.snapshot.params.hotelId;

    if (!this.isNew) {
      this.rService.getRoom(this.hotelId, roomNumber).subscribe( res => {
        this.model = res;
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
        this.isPageInitialized = true;
        this.dataSource = new MatTableDataSource<string>(this.model.images);
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
      this.isPageInitialized = true;
    }
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
        this.snackBar.open(err, 'Error', {
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
        this.snackBar.open(err, 'Error', {
          duration: 2000
        });
      });
    }
  }

  getPhotoFile(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  uploadRoomPhoto(file: File, roomNumber: number): void {
    this.iService.uploadRoomImage(file, this.hotelId, roomNumber).subscribe(res => {
      this.snackBar.open('Photo upload successful!', 'Update', {
        duration: 2000
      });
    }, err => {
      this.snackBar.open(err, 'Error', {
        duration: 2000
      });
    });
  }

  cancel() {
    this.roomForm.reset();
    this.router.navigate(['admin']);
  }

  deleteImages() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: { title: 'Are you sure about deleting the all the images?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.iService.deleteRoomImages(this.model.images, this.hotelId, this.model.number).subscribe(res => {
          this.snackBar.open('Photos removed successfully!', 'Update', {
            duration: 2000
          });
          this.model.images = [];
          this.dataSource = new MatTableDataSource<string>(this.model.images);
        }, err => {
          this.snackBar.open(err, 'Error', {
            duration: 2000
          });
        });
      }
    });
  }

  deleteImage(name: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: { title: 'Are you sure about deleting the selected image?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.iService.deleteHotelImages([name], this.model._id).subscribe(res => {
          this.snackBar.open('Photo removed successfully!', 'Update', {
            duration: 2000
          });
          this.model.images = this.model.images.filter(x => x !== name);
          this.dataSource = new MatTableDataSource<string>(this.model.images);
        }, err => {
          this.snackBar.open(err, 'Error', {
            duration: 2000
          });
        });
      }
    });
  }

}
