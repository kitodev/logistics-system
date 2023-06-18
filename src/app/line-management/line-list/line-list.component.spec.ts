import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LineListComponent } from './line-list.component';
import { getTranslocoModule } from '../../../test/transloco-module.spec';
import { ClarityModule } from '@clr/angular';
import { LineService } from '../line.service';
import { of } from 'rxjs';
import { CommentService } from '../../shared/components/comments/comment.service';
import { VehicleService } from '../../clients/company/vehicle.service';
import { UserSettingsService } from '../../shared/system/user-settings.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SelectOneFilterComponent } from '../../shared/table/filters/select-one-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { userSettingsServiceMock } from 'src/test/user-settings-service-mock.spec';
import { lineServiceMock } from '../../../test/line-service-mock.spec';

describe('LineListComponent', () => {
  let component: LineListComponent;
  let fixture: ComponentFixture<LineListComponent>;
  const commentServiceMock = {
    getComments: () => of([] as CommentDto[]),
  };

  const vehicleServiceMock: Partial<VehicleService> = {
    getVehicleTypes: () => [
      {
        label: 'Személyautó',
        value: 'CAR',
      },
    ],
    getStructureTypes: () => [
      { label: '3,5t-ig', value: 'MAX_HAROM_ES_FEL_TONNAIG' },
    ],
    getFullWeightTypes: () => [
      {
        label: 'Billenős konténer',
        value: 'BILLENOS_KONTENER',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineListComponent, SelectOneFilterComponent],
      imports: [
        RouterTestingModule,
        ClarityModule,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        getTranslocoModule(),
      ],
      providers: [
        {
          provide: LineService,
          useValue: lineServiceMock,
        },
        {
          provide: CommentService,
          useValue: commentServiceMock,
        },
        {
          provide: VehicleService,
          useValue: vehicleServiceMock,
        },
        {
          provide: UserSettingsService,
          useValue: userSettingsServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
