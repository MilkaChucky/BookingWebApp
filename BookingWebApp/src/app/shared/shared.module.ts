import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule, Routes, Router } from '@angular/router';
import { routes } from './../app-routing.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  declarations: [
    FooterComponent
  ],
  exports: [
    MaterialModule,
    FooterComponent,
    RouterModule
  ]
})
export class SharedModule { }
