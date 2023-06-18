import { Role } from './Role';

export interface Token {
  authenticatedEmployee: string;
  sub: string;
  roles: Array<Role>;
  exp: number;
}
