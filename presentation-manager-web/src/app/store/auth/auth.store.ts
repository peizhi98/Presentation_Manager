import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {UserModel} from '../../model/user.model';
import {Login, Logout, SetUser} from './auth.action';
import {AuthService} from '../../service/auth.service';
import {Constant} from '../../../assets/constant/app.constant';
import {ProgressBarStopLoading} from '../app/app.action';
import {NgxPermissionsService} from 'ngx-permissions';
import {MatSnackBar} from '@angular/material/snack-bar';

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

  constructor(private matSnackBar: MatSnackBar, private authService: AuthService, private permissionsService: NgxPermissionsService) {
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
        this.permissionsService.loadPermissions(resp.data.authUserModel.systemRoles);
        ctx.patchState({
          jwt: resp.data.jwt,
          user: resp.data.authUserModel
        });
        this.saveJwtToLocal(resp.data.jwt);

        // this.authService.getAuthUser().subscribe(resp2 => {
        //   if (resp2.data && resp2.status === Constant.RESPONSE_SUCCESS) {
        //     this.permissionsService.loadPermissions(resp2.data.systemRoles);
        //     ctx.patchState(
        //       {user: resp2.data}
        //     );
        //   }
        // });
      } else {
        this.openSnackBar('Invalid Credential');
      }
      ctx.dispatch(new ProgressBarStopLoading());
    });
  }

  openSnackBar(message: string): void {
    this.matSnackBar.open(message, 'dismiss', {
      duration: 5000,
      verticalPosition: 'top'
    });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>): void {
    this.permissionsService.flushPermissions();
    ctx.setState({
      ...defaultState
    });
    this.removeJwtFromLocal();
  }

  @Action(SetUser)
  setUser(ctx: StateContext<AuthStateModel>, action: SetUser): void {
    this.permissionsService.loadPermissions(action.user.systemRoles);
    console.log(action.user);
    ctx.patchState({
        user: action.user
      }
    );
    console.log(ctx.getState().user);
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
