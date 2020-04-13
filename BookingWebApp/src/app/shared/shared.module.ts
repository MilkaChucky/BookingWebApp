import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule, Routes, Router } from '@angular/router';
import { routes } from './../app-routing.module';
import { HeaderNavBarComponent } from './components/header-nav-bar/header-nav-bar.component';
import { AuthenticationModule } from './../modules/authentication/authentication.module';
import { SupportModalComponent } from './components/support-modal/support-modal.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    ),  // TODO: remove in finished
    AuthenticationModule
  ],
  declarations: [
    FooterComponent,
    HeaderNavBarComponent,
    SupportModalComponent
  ],
  exports: [
    MaterialModule,
    FooterComponent,
    HeaderNavBarComponent,
    RouterModule,
    AuthenticationModule
  ],
  entryComponents: [
    SupportModalComponent
  ]
})
export class SharedModule { }
