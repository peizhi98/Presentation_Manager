import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PresentationsViewComponent} from './presentations-view.component';

describe('PresentationListComponent', () => {
  let component: PresentationsViewComponent;
  let fixture: ComponentFixture<PresentationsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresentationsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
