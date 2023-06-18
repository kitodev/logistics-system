import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineMapComponent } from './line-map.component';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TomTomService } from '../../../map/tom-tom.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import tt, {
  BatchItem,
  BatchSummary,
  GenericServiceResponse,
} from '@tomtom-international/web-sdk-services';
import { ActivatedRoute } from '@angular/router';
import { Configuration } from '../../../shared/system/configuration/Configuration';
import { LineService } from '../../line.service';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { lineServiceMock } from '../../../../test/line-service-mock.spec';

@Component({ selector: 'app-map', template: 'map' })
class MapStubComponent {
  public loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}

describe('LineMapComponent', () => {
  let component: LineMapComponent;
  let fixture: ComponentFixture<LineMapComponent>;
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
    route: () => Observable<tt.CalculateRouteResponse>;
  } = {
    route: () => of(undefined),
    geocodeBatch: () => of({ batchItems: [], summary: null }),
  };
  const configServiceMock: {
    loadConfiguration: () => Observable<Configuration>;
  } = {
    loadConfiguration: () =>
      of({ apiUrl: 'http://localhost', tomtom: 'secret api key' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineMapComponent, MapStubComponent],
      imports: [
        FontAwesomeTestingModule,
        RouterTestingModule,
        HttpClientTestingModule,
        getTranslocoModule(),
      ],
      providers: [
        { provide: TomTomService, useValue: tomtomMock },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: LineService, useValue: lineServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
