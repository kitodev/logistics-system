import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '../../../../../test/transloco-module.spec';
import { ConsignmentBulkEditorComponent } from './consignment-bulk-editor.component';
import { consignmentServiceMock } from '../../../../../test/consignment-service-mock.spec';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


describe('ConsignmentBulkEditorComponent', () => {
  let component: ConsignmentBulkEditorComponent;
  let fixture: ComponentFixture<ConsignmentBulkEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignmentBulkEditorComponent ],
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
    fixture = TestBed.createComponent(ConsignmentBulkEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
