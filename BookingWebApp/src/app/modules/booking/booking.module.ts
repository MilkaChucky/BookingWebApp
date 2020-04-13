import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { HotelNavigationComponent } from './hotel-navigation/hotel-navigation.component';
import { RoomNavigationComponent } from './room-navigation/room-navigation.component';
import { HotelCardComponent } from './hotel-card/hotel-card.component';



@NgModule({
  declarations: [
    HotelNavigationComponent,
    HotelCardComponent,
    RoomNavigationComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    HotelNavigationComponent
  ]
})
export class BookingModule { }
