import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { of } from 'rxjs';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { LineDetailsComponent } from './line-details.component';
import { CompanyService } from '../../../clients/company.service';
import { AuthService } from '../../../auth/auth.service';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { authServiceMock } from '../../../../test/auth-service-mock.spec';

describe('LineDetailsComponent', () => {
  let component: LineDetailsComponent;
  let fixture: ComponentFixture<LineDetailsComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineDetailsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        NgSelectModule,
        FontAwesomeTestingModule,
        getTranslocoModule(),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeMock },
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
    fixture = TestBed.createComponent(LineDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
