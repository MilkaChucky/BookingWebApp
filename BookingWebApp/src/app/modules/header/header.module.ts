import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationModule } from './../authentication/authentication.module';
import { SupportModalComponent } from 'src/app/modules/header/support-modal/support-modal.component';
import { HeaderNavBarComponent } from './header-nav-bar/header-nav-bar.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    HeaderNavBarComponent,
    SupportModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthenticationModule
  ],
  exports: [
    HeaderNavBarComponent
  ],
  entryComponents: [
    SupportModalComponent
  ]
})
export class HeaderModule { }
