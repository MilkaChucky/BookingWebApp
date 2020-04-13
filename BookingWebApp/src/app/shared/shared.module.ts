import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule, Routes, Router } from '@angular/router';
import { routes } from './../app-routing.module';
import { HeaderNavBarComponent } from './components/header-nav-bar/header-nav-bar.component';
import { AuthenticationModule } from './../modules/authentication/authentication.module';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    AuthenticationModule
  ],
  declarations: [
    FooterComponent,
    HeaderNavBarComponent
  ],
  exports: [
    MaterialModule,
    FooterComponent,
    HeaderNavBarComponent,
    RouterModule,
    AuthenticationModule
  ]
})
export class SharedModule { }
