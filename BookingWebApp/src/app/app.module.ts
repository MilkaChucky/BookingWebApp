import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './shared/shared.module';
import { HeaderModule } from './modules/header/header.module';
import { FooterComponent } from './shared/components/footer/footer.component';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomeModule } from './modules/home/home.module';
import { BookingModule } from './modules/booking/booking.module';
import { UtilityModule } from './modules/utility/utility.module';
import { AdminModule } from './modules/admin/admin.module';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent
  ],
  imports: [
    BrowserAnimationsModule,
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    HeaderModule,
    HomeModule,
    BookingModule,
    UtilityModule,
    AdminModule
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
