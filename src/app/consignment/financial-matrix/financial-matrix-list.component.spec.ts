import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { of } from 'rxjs';
import { FinanceService } from 'src/app/shared/finance/finance.service';
import { getTranslocoModule } from 'src/test/transloco-module.spec';

import { ConsignmentFinancialMatrixListComponent } from './financial-matrix-list.component';

describe('ConsignmentFinancialMatrixListComponent', () => {
  let component: ConsignmentFinancialMatrixListComponent;
  let fixture: ComponentFixture<ConsignmentFinancialMatrixListComponent>;

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

  const financeServiceMock = {
    getEntries: () => of({} as FinancialEntriesDto),
    deleteEntry: jasmine.createSpy('delete ConsignmentFinanceEntry'),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignmentFinancialMatrixListComponent ],
      imports: [
        ClarityModule,
        getTranslocoModule(),
        FontAwesomeTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: routeMock,
        },
        {
          provide: FinanceService,
          useValue: financeServiceMock,
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentFinancialMatrixListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
