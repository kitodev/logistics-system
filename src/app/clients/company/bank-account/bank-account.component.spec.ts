import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BankAccountComponent } from './bank-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { CompanyService } from '../../company.service';
import { AuthService } from 'src/app/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { HotToastModule } from '@ngneat/hot-toast';
import { NgSelectModule } from '@ng-select/ng-select';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { authServiceMock } from '../../../../test/auth-service-mock.spec';
import { EmployeeRoleDirective } from '../../../auth/employee-role.directive';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';

describe('BankAccountComponent', () => {
  let component: BankAccountComponent;
  let fixture: ComponentFixture<BankAccountComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BankAccountComponent, EmployeeRoleDirective],
        imports: [
          FormsModule,
          ReactiveFormsModule,
          ClarityModule,
          RouterTestingModule,
          FontAwesomeTestingModule,
          NgSelectModule,
          getTranslocoModule(),
          HotToastModule,
        ],
        providers: [
          {
            provide: CompanyService,
            useValue: companyServiceMock,
          },
          {
            provide: AuthService,
            useValue: authServiceMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
