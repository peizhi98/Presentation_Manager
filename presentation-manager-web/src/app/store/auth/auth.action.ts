import {UserModel} from '../../model/user.model';

export class Login {
  static readonly type = '[Auth] Login';

  constructor(public username: string, public password: string) {
  }
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class SetUser {
  static readonly type = '[Auth] Set User';

  constructor(public user: UserModel) {
  }
}

