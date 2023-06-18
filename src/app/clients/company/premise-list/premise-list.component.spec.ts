import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CommentService } from 'src/app/shared/components/comments/comment.service';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { CompanyService } from '../../company.service';

import { PremiseListComponent } from './premise-list.component';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { authServiceMock } from '../../../../test/auth-service-mock.spec';

describe('PremiseListComponent', () => {
  let component: PremiseListComponent;
  let fixture: ComponentFixture<PremiseListComponent>;

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
      declarations: [PremiseListComponent],
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
