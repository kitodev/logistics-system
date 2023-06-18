import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClientsComponent } from './clients.component';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { CompanyService } from './company.service';
import { of } from 'rxjs';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { companyServiceMock } from '../../test/company-service-mock.spec';
import { EmployeeRoleDirective } from '../auth/employee-role.directive';
import { HotToastModule } from '@ngneat/hot-toast';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ClientsComponent', () => {
  let component: ClientsComponent;
  let fixture: ComponentFixture<ClientsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ClientsComponent, EmployeeRoleDirective],
        imports: [
          ClarityModule,
          RouterTestingModule,
          FontAwesomeTestingModule,
          HotToastModule,
          HttpClientTestingModule,
          getTranslocoModule(),
        ],
        providers: [
          {
            provide: CompanyService,
            useValue: companyServiceMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
