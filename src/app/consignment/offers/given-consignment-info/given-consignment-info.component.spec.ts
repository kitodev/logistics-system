import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GivenConsignmentInfoComponent } from './given-consignment-info.component';

describe('GivenConsignmentInfoComponent', () => {
  let component: GivenConsignmentInfoComponent;
  let fixture: ComponentFixture<GivenConsignmentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GivenConsignmentInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GivenConsignmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
