import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatePresentationComponent } from './evaluate-presentation.component';

describe('EvaluatePresentationComponent', () => {
  let component: EvaluatePresentationComponent;
  let fixture: ComponentFixture<EvaluatePresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluatePresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluatePresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
