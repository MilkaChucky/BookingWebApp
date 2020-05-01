import { TestBed } from '@angular/core/testing';

import { HotelService } from './hotel.service';

describe('HotelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HotelService = TestBed.get(HotelService);
    expect(service).toBeTruthy();
  });
});
