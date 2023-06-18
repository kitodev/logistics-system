import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParcelMapComponent } from './parcel-map.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../clients/company.service';
import { AuthService } from '../../../auth/auth.service';
import {
  BatchItem,
  BatchSummary,
  CalculateRouteResponse,
  GenericServiceResponse,
} from '@tomtom-international/web-sdk-services';
import { TomTomService } from '../../../map/tom-tom.service';
import { Component } from '@angular/core';
import { HotToastModule } from '@ngneat/hot-toast';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { LineService } from '../../../line-management/line.service';
import { companyServiceMock } from '../../../../test/company-service-mock.spec';
import { authServiceMock } from '../../../../test/auth-service-mock.spec';
import { consignmentServiceMock } from '../../../../test/consignment-service-mock.spec';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { lineServiceMock } from '../../../../test/line-service-mock.spec';

@Component({ selector: 'app-map', template: 'map' })
class MapStubComponent {
  public loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}

describe('ParcelMapComponent', () => {
  let component: ParcelMapComponent;
  let fixture: ComponentFixture<ParcelMapComponent>;
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

  const tomtomMock: {
    geocodeBatch: () => Observable<{
      batchItems: BatchItem<GenericServiceResponse>[];
      summary: BatchSummary;
    }>;
    route: () => Observable<CalculateRouteResponse>;
    routeWithWaypoints;
  } = {
    route: () => of(undefined),
    geocodeBatch: () => of({ batchItems: [], summary: null }),
    routeWithWaypoints: () =>
      of({
        batchItems: [],
        summary: null,
        getTrackingId: () => '',
        formatVersion: '0',
        routes: [],
      }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParcelMapComponent, MapStubComponent],
      imports: [
        getTranslocoModule(),
        RouterTestingModule,
        HotToastModule,
        FontAwesomeTestingModule,
      ],
      providers: [
        { provide: ConsignmentBEService, useValue: consignmentServiceMock },
        {
          provide: ActivatedRoute,
          useValue: routeMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: CompanyService,
          useValue: companyServiceMock,
        },
        { provide: TomTomService, useValue: tomtomMock },
        { provide: LineService, useValue: lineServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
