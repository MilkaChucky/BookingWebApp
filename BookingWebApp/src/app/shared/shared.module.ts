import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MaterialModule } from './material.module';
import { routes } from './../app-routing.module';

import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    ),  // TODO: remove in finished
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [
  ],
  exports: [
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    HttpClientModule
  ]
})
export class SharedModule {
  constructor(@Optional() @SkipSelf() parentModule: SharedModule) {
    throwIfAlreadyLoaded(parentModule, 'SharedModule');
  }
}
