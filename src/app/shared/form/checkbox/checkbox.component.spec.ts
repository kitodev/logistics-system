import { TestBed, waitForAsync } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';
import { ClarityModule } from '@clr/angular';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';

describe('CheckboxComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [getTranslocoModule(), ClarityModule],
        declarations: [CheckboxComponent],
      }).compileComponents();
    })
  );

  it('should create', () => {
    const fixture = TestBed.createComponent(CheckboxComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
