import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrLotComponent } from './qr-lot.component';
import {
  POPOUT_MODAL_DATA,
  PopoutData,
  PopoutModalName,
} from '../../../shared/popout/PopoutModalData';

describe('QrLotComponent', () => {
  let component: QrLotComponent;
  let fixture: ComponentFixture<QrLotComponent>;
  const lot: LotDto = {
    name: 'test',
    quantity: 0,
    quantityType: QuantityType.BALA,
    stackable: false,
    weight: 0,
  };
  const popoutData: PopoutData = {
    lot,
    text: '',
    modalName: PopoutModalName.CONSIGNMENTS,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QrLotComponent],
      providers: [
        {
          provide: POPOUT_MODAL_DATA,
          useValue: popoutData,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
