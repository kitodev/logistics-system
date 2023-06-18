import { TestBed, waitForAsync } from '@angular/core/testing';
import { ClarityModule } from '@clr/angular';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [getTranslocoModule(), ClarityModule],
        declarations: [SelectComponent],
      }).compileComponents();
    })
  );

  it('should create', () => {
    const fixture = TestBed.createComponent(SelectComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
