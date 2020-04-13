import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  imageSrc = '../../../assets/img/bg_vignette.jpg';
  imageAlt = 'Hotel';

  constructor() { }

  ngOnInit() {
  }

}
