import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { VehicleComponent } from './vehicle.component';
import { ClarityModule } from '@clr/angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { VehicleService } from '../vehicle.service';
import { authServiceMock } from '../../../../test/auth-service-mock.spec';
import { EmployeeRoleDirective } from '../../../auth/employee-role.directive';

describe('VehicleComponent', () => {
  let component: VehicleComponent;
  let fixture: ComponentFixture<VehicleComponent>;

  const routeMock = {
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

  const testVehicle: VehicleDto = {
    companyId: '887997',
    vehicleType: VehicleTypeEnum.CAR,
    licensePlate: 'ABC-123',
    fullWeightType: JarmuOsszTomegEnum.MAX_HAROM_ES_FEL_TONNAIG,
    superStructureType: JarmuFelepitmenyEnum.AUTOSZALLITO,
    cargoSpaceWidth: 1,
    cargoSpaceHeight: 2,
    cargoSpaceLength: 3,
    cargoSpaceVolume: 4,
    palletCount: 1,
    vehicleServiceHistory: [],
    netWeight: { quantity: 15, unit: WeightUnit.T },
    vehicleProperties: {
      felepitmenyKialakitasProperties: [],
      csereFelepitmenyProperties: [],
      emelesEsMozgatasProperties: [],
      felszereltsegProperties: [],
      rakomanyRogzitesProperties: [],
    },
  };

  const vehicleServiceMock: Partial<VehicleService> = {
    getVehicles: () => {
      return of({ content: [testVehicle], number: 1 });
    },
    getVehicleById: (vehicleId, companyId) => of(testVehicle),
    createVehicle: () => of(testVehicle),
    updateVehicle: () => of(testVehicle),
    getVehicleTypes: () => [],
    getFullWeightTypes: () => [],
    getStructureTypes: () => [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleComponent, EmployeeRoleDirective],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: routeMock,
        },
        {
          provide: VehicleService,
          useValue: vehicleServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ClarityModule,
        NoopAnimationsModule,
        getTranslocoModule(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
