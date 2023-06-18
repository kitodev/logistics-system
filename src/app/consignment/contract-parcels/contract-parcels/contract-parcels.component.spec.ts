import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractParcelsComponent } from './contract-parcels.component';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContractParcelsComponent', () => {
  let component: ContractParcelsComponent;
  let fixture: ComponentFixture<ContractParcelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoModule(), HttpClientTestingModule],
      declarations: [ContractParcelsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractParcelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
