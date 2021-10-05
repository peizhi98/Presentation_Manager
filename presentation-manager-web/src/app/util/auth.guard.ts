import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {AuthState} from '../store/auth/auth.store';
import {RouteConstant} from '../../assets/constant/route.contant';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {
  }

  canActivate(): boolean {
    if (this.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate([RouteConstant.LOGIN]);
      return false;
    }

  }

  isAuthenticated(): boolean {
    return this.store.selectSnapshot(AuthState.isAuth);
  }
}
