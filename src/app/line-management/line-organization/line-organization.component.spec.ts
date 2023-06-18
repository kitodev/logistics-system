import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineOrganizationComponent } from './line-organization.component';
import { ClarityModule } from '@clr/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('LineOrganizationComponent', () => {
  let component: LineOrganizationComponent;
  let fixture: ComponentFixture<LineOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineOrganizationComponent],
      imports: [ClarityModule, FontAwesomeTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
