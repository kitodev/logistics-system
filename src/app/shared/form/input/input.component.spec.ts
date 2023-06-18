import { TestBed, waitForAsync } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { ClarityModule } from '@clr/angular';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('InputComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          getTranslocoModule(),
          ClarityModule,
          FormsModule,
          ReactiveFormsModule,
        ],
        declarations: [InputComponent],
      }).compileComponents();
    })
  );

  it('should create', () => {
    const fixture = TestBed.createComponent(InputComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
