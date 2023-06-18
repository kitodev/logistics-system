import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OfferConsignmentComponent } from './offer-consignment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { OfferLifecycleComponent } from '../offer-details/offer-lifecycle/offer-lifecycle.component';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { AuthService } from '../../../auth/auth.service';
import { authServiceMock } from '../../../../test/auth-service-mock.spec';

describe('OfferConsignmentComponent', () => {
  let component: OfferConsignmentComponent;
  let fixture: ComponentFixture<OfferConsignmentComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OfferConsignmentComponent, OfferLifecycleComponent],
        imports: [
          getTranslocoModule(),
          FormsModule,
          ReactiveFormsModule,
          ClarityModule,
          NoopAnimationsModule,
          FontAwesomeTestingModule,
          HttpClientTestingModule,
          RouterTestingModule,
        ],
        providers: [{ provide: AuthService, useValue: authServiceMock }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferConsignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
