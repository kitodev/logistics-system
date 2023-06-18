import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { PremiseComponent } from './premise.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from '../../company.service';
import { AuthService } from 'src/app/auth/auth.service';
import { EmployeeNamePipe } from '../../../shared/pipes/employee/employee-name.pipe';
import { ClarityModule } from '@clr/angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { authServiceMock } from '../../../../test/auth-service-mock.spec';

describe('PremiseComponent', () => {
  let component: PremiseComponent;
  let fixture: ComponentFixture<PremiseComponent>;

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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PremiseComponent, EmployeeNamePipe],
        imports: [
          FormsModule,
          ReactiveFormsModule,
          RouterTestingModule,
          ClarityModule,
          NoopAnimationsModule,
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
