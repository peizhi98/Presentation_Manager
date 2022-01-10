import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Constant} from '../../assets/constant/app.constant';
import {ResponseModel} from '../model/auth/response.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AuthenticationRequest, AuthenticationResponse} from '../model/auth/authentication';
import {UserModel} from '../model/user/user.model';
import {Logout} from '../store/auth/auth.action';
import {RouteConstant} from '../../assets/constant/route.contant';
import {catchError} from 'rxjs/operators';
import {Store} from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router, private store: Store) {
  }

  private serverUrl = Constant.SERVER_URL;
  private authUrl = '/auth/';

  login(id: string, password: string): Observable<ResponseModel<AuthenticationResponse>> {
    const authenticationRequest = new AuthenticationRequest();
    authenticationRequest.username = id;
    authenticationRequest.password = password;
    return this.http.post<ResponseModel<AuthenticationResponse>>(this.serverUrl + this.authUrl + 'login', authenticationRequest);
  }

  getAuthUser(): Observable<ResponseModel<UserModel>> {
    return this.http.get<ResponseModel<UserModel>>(this.serverUrl + this.authUrl + 'get-auth-user').pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.store.dispatch(new Logout());
          this.router.navigate([RouteConstant.LOGIN]);
        }
      }
      return throwError(err);
    }));
  }
}
