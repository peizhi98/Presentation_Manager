import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserAvailabilityComponent } from './view-user-availability.component';

describe('ViewUserAvailabilityComponent', () => {
  let component: ViewUserAvailabilityComponent;
  let fixture: ComponentFixture<ViewUserAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUserAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
