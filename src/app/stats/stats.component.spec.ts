import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StatsComponent } from './stats.component';
import { ClarityModule } from '@clr/angular';
import { getTranslocoModule } from 'src/test/transloco-module.spec';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StatsComponent],
        imports: [
          ClarityModule,
          getTranslocoModule()
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
