import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CompanyService } from '../../company.service';

import { CompanyDocumentsComponent } from './company-documents.component';
import { ClarityModule } from '@clr/angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AssetsService } from 'src/app/shared/documents/assets.service';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { authServiceMock } from '../../../../test/auth-service-mock.spec';

describe('CompanyDocumentsComponent', () => {
  let component: CompanyDocumentsComponent;
  let fixture: ComponentFixture<CompanyDocumentsComponent>;

  const assetsServiceMock = {
    getFiles: () => of([] as PageAssetDto[]),
    getCompanyDirectories: () => of([] as DirectoryDto[]),
  };

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
      declarations: [CompanyDocumentsComponent],
      imports: [
        RouterTestingModule,
        ClarityModule,
        NoopAnimationsModule,
        getTranslocoModule(),
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
        {
          provide: ActivatedRoute,
          useValue: routeMock,
        },
        {
          provide: AssetsService,
          useValue: assetsServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
