import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompanyService } from 'src/app/clients/company.service';
import { FinanceService } from 'src/app/shared/finance/finance.service';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { FinancialMatrixComponent } from './financial-matrix.component';

describe('FinancialMatrixComponent', () => {
  let component: FinancialMatrixComponent;
  let fixture: ComponentFixture<FinancialMatrixComponent>;


  const financeServiceMock = {
    createLineEntry: jasmine.createSpy('create LineFinanceEntry'),
    updateLineEntry: jasmine.createSpy('update LineFinanceEntry'),
    createConsignmentEntry: jasmine.createSpy('create ConsignmentFinanceEntry'),
    updateConsignmentEntry: jasmine.createSpy('update ConsignmentFinanceEntry'),
  }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialMatrixComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        NgSelectModule,
        FontAwesomeTestingModule,
        getTranslocoModule(),
      ],
      providers: [
        {
          provide: FinanceService,
          useValue: financeServiceMock,
        },
        { provide: CompanyService, useValue: companyServiceMock },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
