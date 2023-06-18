import {
  EmployeeRoleDirective,
  ResourceRule,
} from '../employee-role.directive';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Role } from '../Role';
import { AuthService } from '../auth.service';
import { authServiceMockFactory } from '../../../test/auth-service-mock.spec';

function getElement(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement;
}

describe('EmployeeRoleDirective with rules as Agency', () => {
  let fixture: ComponentFixture<any>;
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [EmployeeRoleDirective, RuleTestComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMockFactory(
            [Role.AGENCY_MANAGER, Role.AGENCY_FINANCIAL],
            'myAgency',
            true
          ),
        },
      ],
    }).createComponent(RuleTestComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
  });

  it('should allow agency manager', () => {
    const element = getElement(fixture);
    expect(element.innerText).toContain('agency_manager_own1');
    expect(element.innerText).not.toContain('agency_own_other2');
    expect(element.innerText).not.toContain('partner_with_own3');
    expect(element.innerText).not.toContain('partner_resource4');
    expect(element.innerText).not.toContain('superadmin_rule5');
    expect(element.innerText).not.toContain('my_agency_resource6');
    expect(element.innerText).not.toContain('my_partner_resource7');
    expect(element.innerText).toContain('my_partner_resource8');
  });
});

describe('EmployeeRoleDirective with rules as Partner', () => {
  let fixture: ComponentFixture<any>;
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [EmployeeRoleDirective, RuleTestComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMockFactory(
            [Role.PARTNER_MANAGER, Role.PARTNER_FINANCIAL],
            'myPartner',
            false,
            'myAgency'
          ),
        },
      ],
    }).createComponent(RuleTestComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
  });

  it('should allow partner for some', () => {
    const element = getElement(fixture);
    expect(element.innerText).not.toContain('agency_manager_own1');
    expect(element.innerText).not.toContain('agency_own_other2');
    expect(element.innerText).not.toContain('partner_with_own3');
    expect(element.innerText).not.toContain('partner_resource4');
    expect(element.innerText).not.toContain('superadmin_rule5');
    expect(element.innerText).not.toContain('my_agency_resource6');
    expect(element.innerText).toContain('my_partner_resource7');
  });
});

@Component({
  template: `
    <div
      *appEmployeeRole="
        [Role.AGENCY_MANAGER];
        resourceRule: ResourceRule.OWN;
        resourceCompanyId: 'myAgency'
      "
    >
      <div>agency_manager_own1</div>
    </div>
    <div
      *appEmployeeRole="
        [Role.AGENCY_MANAGER];
        resourceRule: ResourceRule.OWN;
        resourceCompanyId: 'myPartner'
      "
    >
      <div>agency_own_other2</div>
    </div>
    <div
      *appEmployeeRole="
        [Role.AGENCY_FREIGHT_ORGANISER];
        resourceRule: ResourceRule.PARTNER;
        resourceCompanyId: 'myAgency'
      "
    >
      <div>partner_with_own3</div>
    </div>
    <div
      *appEmployeeRole="
        [Role.PARTNER_FINANCIAL];
        resourceRule: ResourceRule.PARTNER;
        resourceCompanyId: 'myPartner'
      "
    >
      <div>partner_resource4</div>
    </div>
    <div
      *appEmployeeRole="
        [Role.SUPER_ADMIN, Role.AGENCY_FREIGHT_ORGANISER];
        resourceRule: ResourceRule.PARTNER;
        resourceCompanyId: 'myAgency'
      "
    >
      <div>superadmin_rule5</div>
    </div>
    <div
      *appEmployeeRole="
        [Role.PARTNER_FINANCIAL];
        resourceRule: ResourceRule.OWN_AND_PARTNER;
        resourceCompanyId: 'myAgency'
      "
    >
      <div>my_agency_resource6</div>
    </div>
    <div
      *appEmployeeRole="
        [Role.PARTNER_FINANCIAL];
        resourceRule: ResourceRule.OWN_AND_PARTNER;
        resourceCompanyId: 'myPartner'
      "
    >
      <div>my_partner_resource7</div>
    </div>
    <div
      *appEmployeeRole="
        [Role.AGENCY_FINANCIAL];
        resourceRule: ResourceRule.OWN_AND_PARTNER;
        resourceCompanyId: 'myPartner'
      "
    >
      <div>my_partner_resource8</div>
    </div>
  `,
})
class RuleTestComponent {
  Role = Role;
  ResourceRule = ResourceRule;
}
