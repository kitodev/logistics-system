import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLifecycleComponent } from './offer-lifecycle.component';

describe('OfferLifecycleComponent', () => {
  let component: OfferLifecycleComponent;
  let fixture: ComponentFixture<OfferLifecycleComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OfferLifecycleComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLifecycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
