import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationReportMasterComponent } from './evaluation-report-master.component';

describe('EvaluationReportMasterComponent', () => {
  let component: EvaluationReportMasterComponent;
  let fixture: ComponentFixture<EvaluationReportMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationReportMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationReportMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
