import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferBasicComponent } from './offer-basic.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogonModule } from '../../../../logon.module';
import { OfferLifecycleComponent } from '../offer-lifecycle/offer-lifecycle.component';
import { EmployeeRoleDirective } from '../../../../auth/employee-role.directive';

describe('OfferBasicComponent', () => {
  let component: OfferBasicComponent;
  let fixture: ComponentFixture<OfferBasicComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientTestingModule,
          LogonModule,
          FormsModule,
          ReactiveFormsModule,
        ],
        declarations: [
          OfferBasicComponent,
          OfferLifecycleComponent,
          EmployeeRoleDirective,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
