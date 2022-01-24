import {Injectable} from '@angular/core';
import {Constant} from '../../assets/constant/app.constant';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseModel} from '../model/auth/response.model';
import {AvailabilityModel, UserAvailabilityModel} from '../model/availability/availability.model';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  private serverUrl = Constant.SERVER_URL;
  private availabilityUrl = '/availability/';

  constructor(private http: HttpClient) {
  }

  getAvailabilities(): Observable<ResponseModel<AvailabilityModel[]>> {
    return this.http
      .get<ResponseModel<AvailabilityModel[]>>(this.serverUrl + this.availabilityUrl + 'get');
  }

  getUserAvailabilities(userId: number): Observable<ResponseModel<UserAvailabilityModel>> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http
      .get<ResponseModel<UserAvailabilityModel>>(this.serverUrl + this.availabilityUrl + 'get-user-availability',{params});
  }

  addEditAndDeleteAvailabilities(availabilityModels: AvailabilityModel[]): Observable<ResponseModel<AvailabilityModel[]>> {
    return this.http
      .post<ResponseModel<AvailabilityModel[]>>(this.serverUrl + this.availabilityUrl + 'add-edit-delete', availabilityModels);
  }
}
