import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoSchedulingSettingComponent } from './auto-scheduling-setting.component';

describe('AutoSchedulingSettingComponent', () => {
  let component: AutoSchedulingSettingComponent;
  let fixture: ComponentFixture<AutoSchedulingSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoSchedulingSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoSchedulingSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
