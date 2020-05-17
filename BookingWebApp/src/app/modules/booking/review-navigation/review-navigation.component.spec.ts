import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewNavigationComponent } from './review-navigation.component';

describe('ReviewNavigationComponent', () => {
  let component: ReviewNavigationComponent;
  let fixture: ComponentFixture<ReviewNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
