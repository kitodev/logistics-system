import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineConsignmentsComponent } from './line-consignments.component';
import { of } from 'rxjs';
import { CompanyService } from '../../../clients/company.service';
import { LineService } from '../../line.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { ClarityModule } from '@clr/angular';
import { ActivatedRoute } from '@angular/router';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { lineServiceMock } from '../../../../test/line-service-mock.spec';

describe('LineConsignmentsComponent', () => {
  let component: LineConsignmentsComponent;
  let fixture: ComponentFixture<LineConsignmentsComponent>;

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
      declarations: [LineConsignmentsComponent],
      imports: [
        RouterTestingModule,
        FontAwesomeTestingModule,
        ClarityModule,
        getTranslocoModule(),
      ],
      providers: [
        { provide: CompanyService, useValue: companyServiceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        {
          provide: LineService,
          useValue: lineServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineConsignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
