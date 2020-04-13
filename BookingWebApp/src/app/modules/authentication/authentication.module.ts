import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { SharedModule } from './../../shared/shared.module'

@NgModule({
  declarations: [
    LoginModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    LoginModalComponent
  ],
  entryComponents: [
    LoginModalComponent
  ]
})
export class AuthenticationModule { }
