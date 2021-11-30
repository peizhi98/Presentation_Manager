import {UserModel} from './user.model';

export class AuthenticationRequest {
  username: string;
  password: string;
}

export class AuthenticationResponse {
  jwt: string;
}

