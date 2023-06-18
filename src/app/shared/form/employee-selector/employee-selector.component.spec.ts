import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EmployeeSelectorComponent } from './employee-selector.component';
import { ClarityModule } from '@clr/angular';
import { NgSelectModule } from '@ng-select/ng-select';

describe('EmployeeSelectorComponent', () => {
  let component: EmployeeSelectorComponent;
  let fixture: ComponentFixture<EmployeeSelectorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EmployeeSelectorComponent],
        imports: [ClarityModule, NgSelectModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
