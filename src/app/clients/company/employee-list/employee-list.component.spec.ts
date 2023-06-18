import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { EmployeeListComponent } from './employee-list.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CompanyService } from '../../company.service';
import { AuthService } from 'src/app/auth/auth.service';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { EmployeeNamePipe } from '../../../shared/pipes/employee/employee-name.pipe';
import { CommentService } from 'src/app/shared/components/comments/comment.service';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { authServiceMock } from '../../../../test/auth-service-mock.spec';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;

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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EmployeeListComponent, EmployeeNamePipe],
        imports: [
          RouterTestingModule,
          ClarityModule,
          FontAwesomeTestingModule,
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
          {
            provide: CommentService,
            useValue: commentServiceMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
