import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationsTableComponent } from './presentations-table.component';

describe('PresentationsTableComponent', () => {
  let component: PresentationsTableComponent;
  let fixture: ComponentFixture<PresentationsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresentationsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
