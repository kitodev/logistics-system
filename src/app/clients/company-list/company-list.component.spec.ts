import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CompanyListComponent } from './company-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CompanyService } from '../company.service';
import { CommentService } from 'src/app/shared/components/comments/comment.service';
import { of } from 'rxjs';
import { getTranslocoModule } from '../../../test/transloco-module.spec';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { SelectOneFilterComponent } from 'src/app/shared/table/filters/select-one-filter.component';
import { companyServiceMock } from '../../../test/company-service-mock.spec';
import { EmployeeNamePipe } from '../../shared/pipes/employee/employee-name.pipe';
import { AddressPipe } from '../../shared/pipes/address.pipe';

describe('CompanyListComponent', () => {
  let component: CompanyListComponent;
  let fixture: ComponentFixture<CompanyListComponent>;

  const commentServiceMock = {
    getComments: () => of([] as CommentDto[]),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          CompanyListComponent,
          SelectOneFilterComponent,
          EmployeeNamePipe,
          AddressPipe,
        ],
        imports: [
          RouterTestingModule,
          ClarityModule,
          FontAwesomeTestingModule,
          getTranslocoModule(),
        ],
        providers: [
          {
            provide: CompanyService,
            useValue: companyServiceMock,
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
    fixture = TestBed.createComponent(CompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
