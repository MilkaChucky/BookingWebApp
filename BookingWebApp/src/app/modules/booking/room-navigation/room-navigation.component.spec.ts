import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomNavigationComponent } from './room-navigation.component';

describe('RoomNavigationComponent', () => {
  let component: RoomNavigationComponent;
  let fixture: ComponentFixture<RoomNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
