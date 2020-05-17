import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent {
  @Input() images: string[];
  @Input() url: string;
  index: number;

  constructor() {
    this.index = 0;
    if (this.images === undefined || this.images.length === 0) {
      this.images = [''];
    }
  }

  next() {
    if (this.index + 1 < this.images.length) {
      this.index++;
    }
  }

  previous() {
    if (this.index - 1 > -1) {
      this.index--;
    }
  }

}
