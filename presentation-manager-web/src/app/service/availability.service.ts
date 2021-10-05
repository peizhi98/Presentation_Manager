import {Injectable} from '@angular/core';
import {Constant} from '../../assets/constant/app.constant';
import {HttpClient} from '@angular/common/http';
import {EvaluationType} from '../model/evaluation-form.model';
import {Observable} from 'rxjs';
import {ResponseModel} from '../model/response.model';
import {AvailabilityModel} from '../model/availability.model';

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

  addEditAndDeleteAvailabilities(availabilityModels: AvailabilityModel[]): Observable<ResponseModel<AvailabilityModel[]>> {
    return this.http
      .post<ResponseModel<AvailabilityModel[]>>(this.serverUrl + this.availabilityUrl + 'add-edit-delete', availabilityModels);
  }
}
