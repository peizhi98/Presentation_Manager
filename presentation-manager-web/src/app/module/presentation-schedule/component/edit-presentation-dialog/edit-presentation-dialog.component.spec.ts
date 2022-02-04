import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPresentationDialogComponent } from './edit-presentation-dialog.component';

describe('EditPresentationDialogComponent', () => {
  let component: EditPresentationDialogComponent;
  let fixture: ComponentFixture<EditPresentationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPresentationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPresentationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
