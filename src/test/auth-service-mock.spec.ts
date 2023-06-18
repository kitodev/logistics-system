import { AuthService } from '../app/auth/auth.service';
import { Role } from '../app/auth/Role';

export const authServiceMock: Partial<AuthService> = {
  getOwnCompanyId(): string {
    return 'test2';
  },
  isAgency(): boolean {
    return true;
  },
  isLoggedIn(): boolean {
    return true;
  },
  hasRole(): boolean {
    return false;
  },
};

export function authServiceMockFactory(
  roles: Role[],
  myCompanyId: string,
  isAgency: boolean,
  agencyId?: string
): Partial<AuthService> {
  return {
    isLoggedIn(): boolean {
      return true;
    },
    hasRole(role: Role): boolean {
      return roles.includes(role);
    },
    isAgency(): boolean {
      return isAgency;
    },
    getOwnCompanyId(): string {
      return myCompanyId;
    },
    getAgencyId(): string | undefined {
      return agencyId;
    },
  };
}
