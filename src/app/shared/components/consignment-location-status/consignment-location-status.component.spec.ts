import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ConsignmentLocationStatusComponent } from './consignment-location-status.component';
import { StatusService } from './status.service';

describe('ConsignmentLocationStatusComponent', () => {
  let component: ConsignmentLocationStatusComponent;
  let fixture: ComponentFixture<ConsignmentLocationStatusComponent>;

  const statusServiceMock = {
    getStationStatusHistory: () => of([] as StationStatusGetDto[]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignmentLocationStatusComponent ],
      providers: [
        {
          provide: StatusService,
          useValue: statusServiceMock,
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentLocationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
