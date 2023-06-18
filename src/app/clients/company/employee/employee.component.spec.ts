import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';

import { AuthService } from 'src/app/auth/auth.service';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { CompanyService } from '../../company.service';

import { EmployeeComponent } from './employee.component';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { EmployeeSelectorComponent } from '../../../shared/form/employee-selector/employee-selector.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputComponent } from '../../../shared/form/input/input.component';
import { ContactInfoComponent } from '../../../shared/components/contact-info/contact-info.component';
import { of } from 'rxjs';
import { CommentsComponent } from '../../../shared/components/comments/comments.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DateTimePickerComponent } from '../../../shared/form/date-time-picker/date-time-picker.component';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { authServiceMock } from '../../../../test/auth-service-mock.spec';

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;

  const testEmployee: EmployeeDto = {
    companyId: '887997',
    firstName: 'elek',
    lastName: 'teszt',
    phone: '0619876543',
    email: 'test@email.com',
    employeeIdentification: [],
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
    parent: {
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
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EmployeeComponent,
        EmployeeSelectorComponent,
        InputComponent,
        ContactInfoComponent,
        CommentsComponent,
        DateTimePickerComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ClarityModule,
        NoopAnimationsModule,
        NgSelectModule,
        FontAwesomeTestingModule,
        getTranslocoModule(),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: routeMock,
        },
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
