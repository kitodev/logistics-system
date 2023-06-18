import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentInfoComponent } from './consignment-info.component';

describe('ConsignmentInfoComponent', () => {
  let component: ConsignmentInfoComponent;
  let fixture: ComponentFixture<ConsignmentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignmentInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
