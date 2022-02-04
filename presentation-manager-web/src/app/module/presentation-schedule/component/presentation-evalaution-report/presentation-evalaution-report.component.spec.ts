import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationEvalautionReportComponent } from './presentation-evalaution-report.component';

describe('PresentationEvalautionReportComponent', () => {
  let component: PresentationEvalautionReportComponent;
  let fixture: ComponentFixture<PresentationEvalautionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresentationEvalautionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentationEvalautionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
