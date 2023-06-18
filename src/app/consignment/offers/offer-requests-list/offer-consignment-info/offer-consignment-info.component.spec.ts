import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferConsignmentInfoComponent } from './offer-consignment-info.component';

describe('OfferConsignmentInfoComponent', () => {
  let component: OfferConsignmentInfoComponent;
  let fixture: ComponentFixture<OfferConsignmentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferConsignmentInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferConsignmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
