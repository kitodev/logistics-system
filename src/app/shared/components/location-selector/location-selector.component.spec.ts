import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { LocationSelectorComponent } from './location-selector.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';

describe('LocationSelectorComponent', () => {
  let component: LocationSelectorComponent;
  let fixture: ComponentFixture<LocationSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        getTranslocoModule(),
        RouterTestingModule,
        HttpClientTestingModule,
        FontAwesomeTestingModule,
      ],
      declarations: [LocationSelectorComponent],
    }).compileComponents();
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(LocationSelectorComponent);
    component = fixture.componentInstance;
    component.parentForm = fb.group({});
    component.location = {
      companyEmail: '',
      companyId: '',
      companyPhone: '',
      contactPersonId: '',
      customs: false,
      premiseAddress: undefined,
      premiseId: undefined,
      loadingInReferenceNumber: 'in',
      loadingOutReferenceNumber: 'out',
      sender: '',
      timeGate: undefined,
    };
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
