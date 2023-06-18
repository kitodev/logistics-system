import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationInfoComponent } from './location-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AddressPipe } from '../../../../shared/pipes/address.pipe';
import { EmployeeNamePipe } from '../../../../shared/pipes/employee/employee-name.pipe';
import { getTranslocoModule } from '../../../../../test/transloco-module.spec';
import { CompanyService } from '../../../../clients/company.service';
import { TimeGateInfoComponent } from '../time-gate-info/time-gate-info.component';
import { DefaultOrderKeyValuePipe } from '../../../../shared/pipes/default-order-key-value.pipe';
import { companyServiceMock } from '../../../../../test/company-service-mock.spec';

describe('LocationInfoComponent', () => {
  let component: LocationInfoComponent;
  let fixture: ComponentFixture<LocationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        getTranslocoModule(),
      ],
      declarations: [
        LocationInfoComponent,
        AddressPipe,
        EmployeeNamePipe,
        TimeGateInfoComponent,
        DefaultOrderKeyValuePipe,
      ],
      providers: [{ provide: CompanyService, useValue: companyServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationInfoComponent);
    component = fixture.componentInstance;
    component.location = {
      companyEmail: '',
      companyId: '',
      companyPhone: '',
      contactPersonId: '',
      customs: false,
      premiseAddress: undefined,
      premiseId: undefined,
      loadingInReferenceNumber: 'in',
      loadingOutReferenceNumber: 'out',
      sender: '',
      timeGate: {
        earliestArrival: '2021-12-08T00:46:43+01:00',
        latestArrival: '2021-12-10T00:46:43+01:00',
        openingDays: { MONDAY: { openFrom: '08:00', openTo: '17:00' } },
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
