import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopoutData, PopoutModalName, POPOUT_MODAL_DATA } from 'src/app/shared/popout/PopoutModalData';

import { StationConsignmentsComponent } from './station-consignments.component';

describe('StationConsignmentsComponent', () => {
  let component: StationConsignmentsComponent;
  let fixture: ComponentFixture<StationConsignmentsComponent>;

  const leg: LegsOfLineDto = {
    companyName: 'asdasdasd',
    upConsignments: [],
    downConsignments: [],
  };

  const popoutData: PopoutData = {
    leg,
    text: '',
    modalName: PopoutModalName.CONSIGNMENTS,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationConsignmentsComponent ],
      providers: [
        {
          provide: POPOUT_MODAL_DATA,
          useValue: popoutData,
        },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationConsignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
