import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginModalComponent } from './login-modal/login-modal.component';



@NgModule({
  declarations: [
    LoginModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  entryComponents: [
    LoginModalComponent
  ]
})
export class AuthenticationModule { }
