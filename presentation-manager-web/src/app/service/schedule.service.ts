import {Injectable} from '@angular/core';
import {Constant} from '../../assets/constant/app.constant';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseModel} from '../model/auth/response.model';
import {ScheduleModel} from '../model/schedule/schedule.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private serverUrl = Constant.SERVER_URL;
  private presentationUrl = '/schedule/';

  constructor(private http: HttpClient, private userService: AuthService) {
  }

  addOrEditSchedule(scheduleModel: ScheduleModel): Observable<ResponseModel<ScheduleModel>> {
    return this.http.post<ResponseModel<ScheduleModel>>(this.serverUrl + this.presentationUrl + 'add-edit', scheduleModel);
  }

  getSchedules(): Observable<ResponseModel<ScheduleModel[]>> {
    return this.http.get<ResponseModel<ScheduleModel[]>>(this.serverUrl + this.presentationUrl + 'get-schedules');
  }

  getSchedule(id: number): Observable<ResponseModel<ScheduleModel>> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<ResponseModel<ScheduleModel>>(this.serverUrl + this.presentationUrl + 'get-schedule', {params});
  }
}
