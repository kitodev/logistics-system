import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ParcelBasicDataComponent } from './parcel-basic-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { CompanyService } from 'src/app/clients/company.service';
import { AuthService } from 'src/app/auth/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmployeeNamePipe } from '../../../shared/pipes/employee/employee-name.pipe';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { authServiceMock } from '../../../../test/auth-service-mock.spec';
import { consignmentServiceMock } from '../../../../test/consignment-service-mock.spec';

describe('ParcelBasicDataComponent', () => {
  let component: ParcelBasicDataComponent;
  let fixture: ComponentFixture<ParcelBasicDataComponent>;
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
        declarations: [ParcelBasicDataComponent, EmployeeNamePipe],
        imports: [
          RouterTestingModule,
          FormsModule,
          ReactiveFormsModule,
          ClarityModule,
          FontAwesomeTestingModule,
          HttpClientTestingModule,
          NgSelectModule,
          getTranslocoModule(),
        ],
        providers: [
          {
            provide: ConsignmentBEService,
            useValue: consignmentServiceMock,
          },
          {
            provide: CompanyService,
            useValue: companyServiceMock,
          },
          {
            provide: AuthService,
            useValue: authServiceMock,
          },
          {
            provide: ActivatedRoute,
            useValue: routeMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelBasicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
