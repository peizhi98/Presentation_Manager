import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Constant} from '../../assets/constant/app.constant';
import {ResponseModel} from '../model/response.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AuthenticationRequest, AuthenticationResponse} from '../model/authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router) {
  }

  private serverUrl = Constant.SERVER_URL;
  private authUrl = '/auth/';

  login(id: string, password: string): Observable<ResponseModel<AuthenticationResponse>> {
    const authenticationRequest = new AuthenticationRequest();
    authenticationRequest.username = id;
    authenticationRequest.password = password;
    return this.http.post<ResponseModel<AuthenticationResponse>>(this.serverUrl + this.authUrl + 'login', authenticationRequest);
  }
}
