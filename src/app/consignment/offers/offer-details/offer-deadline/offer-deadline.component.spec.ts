import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferDeadlineComponent } from './offer-deadline.component';

describe('OfferDeadlineComponent', () => {
  let component: OfferDeadlineComponent;
  let fixture: ComponentFixture<OfferDeadlineComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OfferDeadlineComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferDeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
