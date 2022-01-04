import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Constant} from '../../assets/constant/app.constant';
import {ResponseModel} from '../model/response.model';
import {LecturerModel} from '../model/role/lecturer.model';
import {UserModel} from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  private serverUrl = Constant.SERVER_URL;
  private userUrl = '/user/';


  register(userModel: UserModel): Observable<ResponseModel<number>> {
    return this.http.post<ResponseModel<number>>(this.serverUrl + this.userUrl + 'register', userModel);
  }

  getAllLecturers(): Observable<ResponseModel<LecturerModel[]>> {
    return this.http.get <ResponseModel<LecturerModel[]>>(this.serverUrl + this.userUrl + 'get-all-lecturers');
  }

  getAllUsers(): Observable<ResponseModel<UserModel[]>> {
    return this.http.get <ResponseModel<UserModel[]>>(this.serverUrl + this.userUrl + 'get-all-users');
  }

  editUser(userModel: UserModel): Observable<ResponseModel<UserModel[]>> {
    return this.http.post <ResponseModel<UserModel[]>>(this.serverUrl + this.userUrl + 'edit-user', userModel);
  }

  deleteUser(id: number): Observable<ResponseModel<boolean>> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete <ResponseModel<boolean>>(this.serverUrl + this.userUrl + 'delete-user', {params});
  }

  createUsers(newUsers: UserModel[]): Observable<ResponseModel<UserModel[]>> {
    return this.http.post<ResponseModel<UserModel[]>>(this.serverUrl + this.userUrl + 'create-users', newUsers);
  }
}
