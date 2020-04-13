import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';



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
