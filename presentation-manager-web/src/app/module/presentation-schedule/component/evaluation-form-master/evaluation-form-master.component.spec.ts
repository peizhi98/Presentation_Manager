import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationFormMasterComponent } from './evaluation-form-master.component';

describe('EvaluationFormMasterComponent', () => {
  let component: EvaluationFormMasterComponent;
  let fixture: ComponentFixture<EvaluationFormMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationFormMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationFormMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
