import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeGateInfoComponent } from './time-gate-info.component';

describe('TimeGateInfoComponent', () => {
  let component: TimeGateInfoComponent;
  let fixture: ComponentFixture<TimeGateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeGateInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeGateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
