import { Component, OnInit, Input } from '@angular/core';
import { HotelModel } from 'src/app/shared/models/HotelModel';

@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrls: ['./hotel-card.component.scss']
})
export class HotelCardComponent implements OnInit {
  @Input() hotel: HotelModel;

  constructor() { }

  ngOnInit() {
  }

}
