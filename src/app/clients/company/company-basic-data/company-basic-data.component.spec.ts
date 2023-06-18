import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CompanyBasicDataComponent } from './company-basic-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { CompanyService } from '../../company.service';
import { AuthService } from 'src/app/auth/auth.service';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { NgxFileDropModule } from 'ngx-file-drop';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { authServiceMock } from '../../../../test/auth-service-mock.spec';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { EmployeeRoleDirective } from '../../../auth/employee-role.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

describe('CompanyBasicDataComponent', () => {
  let component: CompanyBasicDataComponent;
  let fixture: ComponentFixture<CompanyBasicDataComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CompanyBasicDataComponent, EmployeeRoleDirective],
        imports: [
          FormsModule,
          ReactiveFormsModule,
          FontAwesomeTestingModule,
          NgSelectModule,
          NgOptionHighlightModule,
          NgxFileDropModule,
          getTranslocoModule(),
          RouterTestingModule,
          ClarityModule,
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
    fixture = TestBed.createComponent(CompanyBasicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
