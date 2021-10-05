import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Constant} from '../../assets/constant/app.constant';
import {ResponseModel} from '../model/response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  private serverUrl = Constant.SERVER_URL;
  private userUrl = '/user/';


  register(email: string, password: string): Observable<ResponseModel<number>> {
    const params = new HttpParams().set('email', email).set('password', password);
    return this.http.get<ResponseModel<number>>(this.serverUrl + this.userUrl + 'register', {params});
  }

}
