import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    AdminNavigationComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AdminNavigationComponent
  ]
})
export class AdminModule { }
