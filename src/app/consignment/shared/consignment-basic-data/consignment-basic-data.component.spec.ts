import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsignmentBasicDataComponent } from './consignment-basic-data.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EmployeeNamePipe } from '../../../shared/pipes/employee/employee-name.pipe';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';

describe('ConsignmentBasicDataComponent', () => {
  let component: ConsignmentBasicDataComponent;
  let fixture: ComponentFixture<ConsignmentBasicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        getTranslocoModule(),
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        FontAwesomeTestingModule,
      ],
      declarations: [ConsignmentBasicDataComponent, EmployeeNamePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentBasicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
