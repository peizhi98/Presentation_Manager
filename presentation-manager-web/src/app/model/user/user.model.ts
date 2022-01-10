export class UserModel {
  id: number;
  email: string;
  name: string;
  password: string;
  systemRoles: SystemRole[];
}

export enum SystemRole {
  ADMIN = 'ADMIN',
  COORDINATOR = 'COORDINATOR',
  LECTURER = 'LECTURER',
  OFFICE = 'OFFICE'
}

