import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
}
