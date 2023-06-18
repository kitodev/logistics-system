import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getTranslocoModule } from '../../../../../test/transloco-module.spec';
import { OrderBulkEditorComponent } from './order-bulk-editor.component';
import { consignmentServiceMock } from '../../../../../test/consignment-service-mock.spec';
import { NgSelectModule } from '@ng-select/ng-select';

describe('OrderBulkEditorComponent', () => {
  let component: OrderBulkEditorComponent;
  let fixture: ComponentFixture<OrderBulkEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderBulkEditorComponent ],
      imports: [
        getTranslocoModule(),
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
      ],
      providers: [{ provide: ConsignmentBEService, useValue: consignmentServiceMock }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBulkEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
