import { EmployeeRoleDirective } from '../employee-role.directive';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Role } from '../Role';
import { AuthService } from '../auth.service';
import { authServiceMockFactory } from '../../../test/auth-service-mock.spec';

function getElement(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement;
}

describe('EmployeeRoleDirective as Agency Manager & Agency Financial', () => {
  let fixture: ComponentFixture<any>;
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [EmployeeRoleDirective, SimpleTestComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMockFactory(
            [Role.AGENCY_MANAGER, Role.AGENCY_FINANCIAL],
            'myagencycompany123',
            true
          ),
        },
      ],
    }).createComponent(SimpleTestComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
  });

  it('should allow agency manager', () => {
    const element = getElement(fixture);
    expect(element.innerText).toContain('agency_manager');
    expect(element.innerText).toContain('agency_financial');
    expect(element.innerText).toContain('agency_manager_financial');
  });
  it('should NOT allow agency manager', () => {
    const element = getElement(fixture);
    expect(element.innerText).not.toContain('super_admin');
    expect(element.innerText).not.toContain('partner_financial');
    expect(element.innerText).not.toContain('partner_financial_freight');
  });
});

describe('EmployeeRoleDirective as Superadmin', () => {
  let fixture: ComponentFixture<any>;
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [EmployeeRoleDirective, SimpleTestComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMockFactory(
            [Role.SUPER_ADMIN],
            'supercompany',
            true
          ),
        },
      ],
    }).createComponent(SimpleTestComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
  });

  it('should allow ALL to superadmin', () => {
    const element = getElement(fixture);
    expect(element.innerText).toContain('agency_manager');
    expect(element.innerText).toContain('agency_financial');
    expect(element.innerText).toContain('agency_manager_financial');
    expect(element.innerText).toContain('super_admin');
    expect(element.innerText).toContain('partner_financial');
    expect(element.innerText).toContain('partner_financial_freight');
  });
});

@Component({
  template: `
    <div *appEmployeeRole="[Role.AGENCY_MANAGER]">
      <div>agency_manager</div>
    </div>
    <div *appEmployeeRole="[Role.SUPER_ADMIN]">
      <div>super_admin</div>
    </div>
    <div *appEmployeeRole="[Role.PARTNER_FINANCIAL]">
      <div>partner_financial</div>
    </div>
    <div
      *appEmployeeRole="[Role.PARTNER_FINANCIAL, Role.AGENCY_FREIGHT_ORGANISER]"
    >
      <div>partner_financial_freight</div>
    </div>
    <div *appEmployeeRole="[Role.AGENCY_FINANCIAL]">
      <div>agency_financial</div>
    </div>
    <div *appEmployeeRole="[Role.AGENCY_FINANCIAL, Role.AGENCY_MANAGER]">
      <div>agency_manager_financial</div>
    </div>
  `,
})
class SimpleTestComponent {
  Role = Role;
}
