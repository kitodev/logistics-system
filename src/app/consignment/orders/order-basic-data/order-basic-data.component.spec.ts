import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { getTranslocoModule } from 'src/test/transloco-module.spec';
import { consignmentServiceMock } from '../../../../test/consignment-service-mock.spec';
import { OrderBasicDataComponent } from './order-basic-data.component';

describe('OrderBasicDataComponent', () => {
  let component: OrderBasicDataComponent;
  let fixture: ComponentFixture<OrderBasicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderBasicDataComponent ],
      imports: [
        getTranslocoModule(),
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
      ],
      providers: [{ provide: ConsignmentBEService, useValue: consignmentServiceMock }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBasicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
