import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { EditHotelComponent } from './admin-navigation/edit/edit-hotel/edit-hotel.component';
import { AddRoomModalComponent } from './admin-navigation/edit/edit-room/add-room-modal.component';



@NgModule({
  declarations: [
    AdminNavigationComponent,
    EditHotelComponent,
    AddRoomModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AdminNavigationComponent
  ],
  entryComponents: [
    EditHotelComponent,
    AddRoomModalComponent
  ]
})
export class AdminModule { }
