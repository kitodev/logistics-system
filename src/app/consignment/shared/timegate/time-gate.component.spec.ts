import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { TimeGateComponent } from './time-gate.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefaultOrderKeyValuePipe } from '../../../shared/pipes/default-order-key-value.pipe';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { ClarityModule } from '@clr/angular';

describe('TimegateComponent', () => {
  let component: TimeGateComponent;
  let fixture: ComponentFixture<TimeGateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        getTranslocoModule(),
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
      ],
      declarations: [TimeGateComponent, DefaultOrderKeyValuePipe],
    }).compileComponents();
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(TimeGateComponent);
    component = fixture.componentInstance;
    component.parentForm = fb.group({});
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
