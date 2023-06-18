import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from './auth.service';
import { Role } from './Role';

export enum ResourceRule {
  OWN = 'OWN',
  PARTNER = 'PARTNER',
  OWN_AND_PARTNER = 'OWN_AND_PARTNER',
  OWN_AND_AGENCY = 'OWN_AND_AGENCY',
}

@Directive({
  selector: '[appEmployeeRole]',
})
export class EmployeeRoleDirective implements OnInit {
  roles: Role[];

  @Input()
  set appEmployeeRole(roles: Role[]) {
    this.roles = roles;
  }

  @Input()
  appEmployeeRoleResourceCompanyId: string;

  @Input()
  appEmployeeRoleResourceRule: ResourceRule;

  constructor(
    private templateRef: TemplateRef<any>,
    private authService: AuthService,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    let hasAccess = this.hasRole() && this.resourceIsAllowed();

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private hasRole(): boolean {
    let hasRole = false;
    if (this.authService.isLoggedIn() && this.roles) {
      hasRole = this.roles.some((role) => {
        return this.authService.hasRole(role);
      });
      if (!hasRole) {
        hasRole = this.authService.hasRole(Role.SUPER_ADMIN);
      }
    }
    return hasRole;
  }

  private resourceIsAllowed(): boolean {
    if (!this.appEmployeeRoleResourceRule) {
      return true;
    }
    if (!this.appEmployeeRoleResourceCompanyId) {
      return false;
    }
    const myCompany = this.authService.getOwnCompanyId();
    switch (this.appEmployeeRoleResourceRule) {
      case ResourceRule.OWN:
        return myCompany === this.appEmployeeRoleResourceCompanyId;
      case ResourceRule.PARTNER:
        return (
          myCompany !== this.appEmployeeRoleResourceCompanyId &&
          !this.authService.isAgency()
        );
      case ResourceRule.OWN_AND_PARTNER:
        return (
          this.appEmployeeRoleResourceCompanyId === myCompany ||
          this.authService.isAgency()
        );
      case ResourceRule.OWN_AND_AGENCY:
        return (
          this.appEmployeeRoleResourceCompanyId === myCompany ||
          this.appEmployeeRoleResourceCompanyId ===
            this.authService.getAgencyId()
        );
    }
  }
}
