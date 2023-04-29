import { User } from './user.model';

export class PasswordChange {
  constructor(user: User, currentPassword: string) {
    this.user = user;
    this.currentPassword = currentPassword;
  }

  user: User = new User();
  currentPassword: string='';
}
