import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkingSchemeDialogComponent } from './marking-scheme-dialog.component';

describe('MarkingSchemeDialogComponent', () => {
  let component: MarkingSchemeDialogComponent;
  let fixture: ComponentFixture<MarkingSchemeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkingSchemeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkingSchemeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
