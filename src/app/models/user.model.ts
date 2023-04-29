import { Role } from './role.enum';

export class User {
  id: number=0;
  username: string= "";
  password: string = "";
  pin: string = "";
  name: string = "";
  accessToken: string = "";
  refreshToken: string = "";
  role: Role = Role.USER;
}