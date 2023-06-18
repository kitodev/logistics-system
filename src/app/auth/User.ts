import { Role } from './Role';
import { ApplicationEmployee } from './ApplicationEmployee';

export interface User {
  userName: string;
  email: string;
  roles: Array<Role>;
  companyId: string;
  employee: ApplicationEmployee;
}
