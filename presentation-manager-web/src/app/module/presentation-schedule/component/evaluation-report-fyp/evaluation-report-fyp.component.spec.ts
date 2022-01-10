import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationReportFypComponent } from './evaluation-report-fyp.component';

describe('EvaluationReportFypComponent', () => {
  let component: EvaluationReportFypComponent;
  let fixture: ComponentFixture<EvaluationReportFypComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationReportFypComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationReportFypComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
