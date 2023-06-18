import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferResultsComponent } from './offer-results.component';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('OfferResultsComponent', () => {
  let component: OfferResultsComponent;
  let fixture: ComponentFixture<OfferResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfferResultsComponent],
      imports: [ClarityModule, FontAwesomeTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
