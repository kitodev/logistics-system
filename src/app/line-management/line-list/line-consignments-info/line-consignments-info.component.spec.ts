import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineConsignmentsInfoComponent } from './line-consignments-info.component';

describe('LineConsignmentsInfoComponent', () => {
  let component: LineConsignmentsInfoComponent;
  let fixture: ComponentFixture<LineConsignmentsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineConsignmentsInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineConsignmentsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
