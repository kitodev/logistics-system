import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OfferAddresseeComponent } from './offer-addressee.component';
import { CompanyService } from '../../../clients/company.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OfferLifecycleComponent } from '../offer-details/offer-lifecycle/offer-lifecycle.component';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { EmployeeNamePipe } from '../../../shared/pipes/employee/employee-name.pipe';

describe('OfferAddresseeComponent', () => {
  let component: OfferAddresseeComponent;
  let fixture: ComponentFixture<OfferAddresseeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          OfferAddresseeComponent,
          OfferLifecycleComponent,
          EmployeeNamePipe,
        ],
        imports: [
          HttpClientTestingModule,
          RouterTestingModule,
          getTranslocoModule(),
          ClarityModule,
          NoopAnimationsModule,
          NgSelectModule,
          FontAwesomeTestingModule,
        ],
        providers: [{ provide: CompanyService, useValue: companyServiceMock }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferAddresseeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
