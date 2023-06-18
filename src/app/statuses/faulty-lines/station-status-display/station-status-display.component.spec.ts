import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationStatusDisplayComponent } from './station-status-display.component';

describe('StationStatusDisplayComponent', () => {
  let component: StationStatusDisplayComponent;
  let fixture: ComponentFixture<StationStatusDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationStatusDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationStatusDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
