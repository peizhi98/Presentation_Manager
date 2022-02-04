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
  private scheduleUrl = '/schedule/';

  constructor(private http: HttpClient, private userService: AuthService) {
  }

  addOrEditSchedule(scheduleModel: ScheduleModel): Observable<ResponseModel<ScheduleModel>> {
    return this.http.post<ResponseModel<ScheduleModel>>(this.serverUrl + this.scheduleUrl + 'add-edit', scheduleModel);
  }

  getSchedules(): Observable<ResponseModel<ScheduleModel[]>> {
    return this.http.get<ResponseModel<ScheduleModel[]>>(this.serverUrl + this.scheduleUrl + 'get-schedules');
  }

  getMasterSchedules(): Observable<ResponseModel<ScheduleModel[]>> {
    return this.http.get<ResponseModel<ScheduleModel[]>>(this.serverUrl + this.scheduleUrl + 'get-master');
  }

  getSchedule(id: number): Observable<ResponseModel<ScheduleModel>> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<ResponseModel<ScheduleModel>>(this.serverUrl + this.scheduleUrl + 'get-schedule', {params});
  }

  deleteSchedule(id: number): Observable<ResponseModel<boolean>> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<ResponseModel<boolean>>(this.serverUrl + this.scheduleUrl + 'delete-schedule', {params});
  }
}
