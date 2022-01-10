import {UserModel} from '../user/user.model';

export class AuthenticationRequest {
  username: string;
  password: string;
}

export class AuthenticationResponse {
  jwt: string;
  authUserModel: UserModel;
}

