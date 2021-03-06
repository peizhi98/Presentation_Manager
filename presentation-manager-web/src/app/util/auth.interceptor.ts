import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../service/auth.service';
import {Store} from '@ngxs/store';
import {AuthState} from '../store/auth/auth.store';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {RouteConstant} from '../../assets/constant/route.contant';
import {Logout} from '../store/auth/auth.action';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: AuthService, private store: Store, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const jwt = this.userService.getToken();
    const jwt = this.store.selectSnapshot(AuthState.getJwt);
    if (jwt) {
      const modifiedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${jwt}`),
      });
      return next.handle(modifiedReq).pipe(catchError(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.store.dispatch(new Logout());
              this.router.navigate([RouteConstant.LOGIN]);
            }
            return throwError(err);
          }
        }));
      //   .pipe(catchError(err => {
      //   if (err instanceof HttpErrorResponse) {
      //     if (err.status === 401) {
      //       this.store.dispatch(new Logout());
      //       this.router.navigate([RouteConstant.LOGIN]);
      //     }
      //     return throwError(err);
      //   }
      // }));
    }
    return next.handle(req);
  }
}
