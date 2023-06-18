import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineManagementComponent } from './line-management.component';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('LineManagementComponent', () => {
  let component: LineManagementComponent;
  let fixture: ComponentFixture<LineManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineManagementComponent],
      imports: [ClarityModule, FontAwesomeTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
