import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FooterComponent } from './components/footer/footer.component';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FooterComponent
  ],
  exports: [
    MaterialModule,
    FooterComponent
  ]
})
export class SharedModule { }
