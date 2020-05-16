import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { EditHotelComponent } from './admin-navigation/edit/edit-hotel/edit-hotel.component';
import { EditRoomComponent } from './admin-navigation/edit/edit-room/edit-room.component';



@NgModule({
  declarations: [
    AdminNavigationComponent,
    EditHotelComponent,
    EditRoomComponent
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
    EditRoomComponent
  ]
})
export class AdminModule { }
