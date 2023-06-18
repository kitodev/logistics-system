import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferRequestsListComponent } from './offer-requests-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { DateRangeFilterComponent } from '../../../shared/table/filters/date-range-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('OfferRequestsListComponent', () => {
  let component: OfferRequestsListComponent;
  let fixture: ComponentFixture<OfferRequestsListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          HttpClientTestingModule,
          ClarityModule,
          FontAwesomeTestingModule,
          RouterTestingModule,
          getTranslocoModule(),
        ],
        declarations: [OfferRequestsListComponent, DateRangeFilterComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
