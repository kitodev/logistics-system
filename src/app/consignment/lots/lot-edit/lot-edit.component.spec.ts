import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotEditComponent } from './lot-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';

describe('LotEditComponent', () => {
  let component: LotEditComponent;
  let fixture: ComponentFixture<LotEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoModule(), FormsModule, ReactiveFormsModule],
      declarations: [LotEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotEditComponent);
    component = fixture.componentInstance;
    component.lot = {
      name: '',
      quantity: 0,
      quantityType: undefined,
      stackable: false,
      weight: 0,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
