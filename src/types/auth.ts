export type UserRole = 
  | 'externaluser'
  | 'agentuser'
  | 'staffuser'
  | 'manageruser'
  | 'directUser'
  | 'apiuser'
  | 'adminuser'
  | 'ucieruser';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
}