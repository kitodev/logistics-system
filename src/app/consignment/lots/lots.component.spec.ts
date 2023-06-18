import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { LotsComponent } from './lots.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { getTranslocoModule } from '../../../test/transloco-module.spec';

describe('LotsComponent', () => {
  let component: LotsComponent;
  let fixture: ComponentFixture<LotsComponent>;
  const lotServiceMock = {
    deleteLot: jasmine.createSpy('delete lot'),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LotsComponent],
        imports: [
          FormsModule,
          ReactiveFormsModule,
          ClarityModule,
          getTranslocoModule(),
        ],
        providers: [{ provide: ConsignmentBEService, useValue: lotServiceMock }],
      }).compileComponents();
    })
  );

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(LotsComponent);
    component = fixture.componentInstance;
    component.parentForm = fb.group({});
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
