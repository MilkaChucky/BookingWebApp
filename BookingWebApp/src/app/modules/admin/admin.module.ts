import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { AddHotelModalComponent } from './admin-navigation/modals/add-hotel-modal/add-hotel-modal.component';



@NgModule({
  declarations: [
    AdminNavigationComponent,
    AddHotelModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AdminNavigationComponent
  ],
  entryComponents: [
    AddHotelModalComponent
  ]
})
export class AdminModule { }
