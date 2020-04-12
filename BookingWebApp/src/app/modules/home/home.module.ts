import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page/landing-page.component';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
  declarations: [
    LandingPageComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule
  ],
  exports: [
    LandingPageComponent
  ]
})
export class HomeModule { }
