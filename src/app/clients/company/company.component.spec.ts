import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CompanyService } from '../company.service';
import { CompanyComponent } from './company.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { companyServiceMock } from '../../../test/company-service-mock.spec';

describe('CompanyComponent', () => {
  let component: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;
  const company: CompanyDto = {
    companyName: '',
    companyProfiles: [],
    email: '',
    phone: '+123546789',
    taxNumber: '123123123123-2-41',
    registrationNumber: '1-2-12312313123',
    billingElectronic: true,
    billingPaymentDeadlineDays: 30,
    billingLanguage: BillingLanguage.hu,
    billingPaymentMethod: PaymentMethod.TRANSFER,
    mailingAddress: {
      city: 'Budapest',
      country: 'HU',
      postCode: '1134',
      county: 'Budapest',
      streetName: 'Váci',
      streetType: 'út',
      streetNumber: '49',
    },
    premises: [
      {
        companyId: '887997',
        name: 'seat',
        premiseType: PremiseType.SEAT,
        address: {
          country: 'HU',
          city: 'Budapest',
          postCode: '1000',
          county: 'Budapest',
          streetName: 'Városház',
          streetType: 'tér',
          streetNumber: '12a',
        },
        openingDays: {},
      },
    ],
  };

  const routeMock = {
    paramMap: of({
      keys: ['id'],
      get(name: string): string | null {
        if (name == 'id') {
          return '1234';
        }
        return null;
      },
      getAll(): string[] {
        return [];
      },
      has(name: string): boolean {
        return name === 'id';
      },
    }),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CompanyComponent],
        imports: [RouterTestingModule, ClarityModule, FontAwesomeTestingModule],
        providers: [
          { provide: CompanyService, useValue: companyServiceMock },
          { provide: ActivatedRoute, useValue: routeMock },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
