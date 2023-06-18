import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CompanyDetailsComponent } from './company-details.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CompanyBasicDataComponent } from '../company-basic-data/company-basic-data.component';
import { BankAccountComponent } from '../bank-account/bank-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from '../../company.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommentsComponent } from '../../../shared/components/comments/comments.component';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { EmployeeRoleDirective } from '../../../auth/employee-role.directive';

describe('CompanyDetailsComponent', () => {
  let component: CompanyDetailsComponent;
  let fixture: ComponentFixture<CompanyDetailsComponent>;
  const routeMock = {
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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          CompanyDetailsComponent,
          CompanyBasicDataComponent,
          BankAccountComponent,
          CommentsComponent,
          EmployeeRoleDirective,
        ],
        imports: [
          HttpClientTestingModule,
          FormsModule,
          ReactiveFormsModule,
          RouterTestingModule,
        ],
        providers: [
          { provide: CompanyService, useValue: companyServiceMock },
          {
            provide: ActivatedRoute,
            useValue: routeMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
