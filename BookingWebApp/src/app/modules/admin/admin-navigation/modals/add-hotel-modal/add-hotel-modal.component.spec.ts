import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHotelModalComponent } from './add-hotel-modal.component';

describe('AddHotelModalComponent', () => {
  let component: AddHotelModalComponent;
  let fixture: ComponentFixture<AddHotelModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHotelModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHotelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
