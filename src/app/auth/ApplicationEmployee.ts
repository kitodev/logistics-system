import { Role } from './Role';

export interface ApplicationEmployee {
  companyId: string;
  employeeId: string;
  applicationUserId: string;
  roles: Array<Role>;
  agency: boolean;
  agencyId: string;
  superAdmin: boolean;
}
