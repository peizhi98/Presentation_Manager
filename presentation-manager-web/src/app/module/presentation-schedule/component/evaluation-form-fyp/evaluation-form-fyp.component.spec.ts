import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationFormFypComponent } from './evaluation-form-fyp.component';

describe('EvaluationFormFypComponent', () => {
  let component: EvaluationFormFypComponent;
  let fixture: ComponentFixture<EvaluationFormFypComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationFormFypComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationFormFypComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
