import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelNavigationComponent } from './hotel-navigation.component';

describe('HotelNavigationComponent', () => {
  let component: HotelNavigationComponent;
  let fixture: ComponentFixture<HotelNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
