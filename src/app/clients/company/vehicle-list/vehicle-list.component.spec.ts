import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CompanyService } from '../../company.service';

import { VehicleListComponent } from './vehicle-list.component';
import { ClarityModule } from '@clr/angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommentService } from 'src/app/shared/components/comments/comment.service';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogonModule } from '../../../logon.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { authServiceMock } from '../../../../test/auth-service-mock.spec';
import { EmployeeRoleDirective } from '../../../auth/employee-role.directive';

describe('VehicleListComponent', () => {
  let component: VehicleListComponent;
  let fixture: ComponentFixture<VehicleListComponent>;

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

  const commentServiceMock = {
    getComments: () => of([] as CommentDto[]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleListComponent, EmployeeRoleDirective],
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
        {
          provide: CommentService,
          useValue: commentServiceMock,
        },
      ],
      imports: [
        RouterTestingModule,
        ClarityModule,
        FontAwesomeTestingModule,
        NoopAnimationsModule,
        getTranslocoModule(),
        HttpClientTestingModule,
        FormsModule,
        LogonModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
