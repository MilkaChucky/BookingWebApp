import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelNavigationComponent } from './hotel-navigation/hotel-navigation.component';



@NgModule({
  declarations: [
    HotelNavigationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HotelNavigationComponent
  ]
})
export class BookingModule { }
