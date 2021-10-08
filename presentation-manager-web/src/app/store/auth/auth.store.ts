import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {UserModel} from '../../model/user.model';
import {Login, Logout, SetUser} from './auth.action';
import {AuthService} from '../../service/auth.service';
import {Constant} from '../../../assets/constant/app.constant';
import {ProgressBarStopLoading} from '../app/app.action';

export class AuthStateModel {
  jwt: string;
  user: UserModel;
}

export const defaultState = {
  jwt: null,
  user: null,
};

@State<AuthStateModel>({
  name: 'auth',
  defaults: defaultState
})

@Injectable()
export class AuthState implements NgxsOnInit {
  @Selector()
  public static getUser(state: AuthStateModel): UserModel {
    return state.user;
  }

  @Selector()
  public static getJwt(state: AuthStateModel): string {
    return state.jwt;
  }

  @Selector()
  public static isAuth(state: AuthStateModel): boolean {
    return !!state.jwt;
  }

  constructor(private authService: AuthService) {
  }

  ngxsOnInit(ctx: StateContext<AuthStateModel>): void {
    const jwt = this.retrieveJwtFromLocal();
    if (jwt) {
      ctx.patchState({
        jwt: this.retrieveJwtFromLocal()
      });
    }
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login): void {
    this.authService.login(action.username, action.password).subscribe(resp => {
      if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
        ctx.patchState({
          jwt: resp.data.jwt
        });
        this.saveJwtToLocal(resp.data.jwt);
        ctx.dispatch(new ProgressBarStopLoading());
      }
    });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>): void {
    ctx.setState({
      ...defaultState
    });
    this.removeJwtFromLocal();
  }

  @Action(SetUser)
  setUser(ctx: StateContext<AuthStateModel>, action: SetUser): void {
    ctx.patchState({
        user: action.user
      }
    );
  }

  saveJwtToLocal(jwt: string): void {
    localStorage.setItem('jwt', jwt);
  }

  retrieveJwtFromLocal(): string {
    return localStorage.getItem('jwt');
  }

  removeJwtFromLocal(): void {
    localStorage.removeItem('jwt');
  }


}
