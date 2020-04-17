import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { AddHotelModalComponent } from './admin-navigation/modals/add-hotel-modal/add-hotel-modal.component';
import { AddRoomModalComponent } from './admin-navigation/modals/add-room-modal/add-room-modal.component';



@NgModule({
  declarations: [
    AdminNavigationComponent,
    AddHotelModalComponent,
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
    AddHotelModalComponent,
    AddRoomModalComponent
  ]
})
export class AdminModule { }
