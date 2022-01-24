import {Injectable} from '@angular/core';
import {Constant} from '../../assets/constant/app.constant';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseModel} from '../model/auth/response.model';
import {AutoSchedulingModel, PresentationModel, PresentationScheduleModel} from '../model/presentation/presentation.model';


@Injectable({
  providedIn: 'root'
})
export class PresentationService {

  private serverUrl = Constant.SERVER_URL;
  private presentationUrl = '/presentation/';

  constructor(private http: HttpClient) {
  }

  addPresentationList(presentationList: PresentationModel[]): Observable<ResponseModel<PresentationModel[]>> {
    return this.http
      .post<ResponseModel<PresentationModel[]>>(this.serverUrl + this.presentationUrl + 'add-presentation-list', presentationList);
  }

  getPresentation(id: number): Observable<ResponseModel<PresentationModel>> {
    const params = new HttpParams().set('id', id.toString());
    return this.http
      .get<ResponseModel<PresentationModel>>(this.serverUrl + this.presentationUrl + 'get-presentation', {params});
  }

  getPresentations(scheduleId: number): Observable<ResponseModel<PresentationModel[]>> {
    const params = new HttpParams().set('scheduleId', scheduleId.toString());
    return this.http
      .get<ResponseModel<PresentationModel[]>>(this.serverUrl + this.presentationUrl + 'get-presentations', {params});
  }

  getPresentationsWithAvailability(scheduleId: number): Observable<ResponseModel<PresentationModel[]>> {
    const params = new HttpParams().set('scheduleId', scheduleId.toString());
    return this.http
      .get<ResponseModel<PresentationModel[]>>(this.serverUrl + this.presentationUrl + 'get-presentations-with-availability', {params});
  }

  getPresentationsAsPanel(): Observable<ResponseModel<PresentationModel[]>> {
    return this.http
      .get<ResponseModel<PresentationModel[]>>(this.serverUrl + this.presentationUrl + 'get-presentations-panel');
  }

  getPresentationsAsSupervisor(): Observable<ResponseModel<PresentationModel[]>> {
    return this.http
      .get<ResponseModel<PresentationModel[]>>(this.serverUrl + this.presentationUrl + 'get-presentations-supervisor');
  }

  schedulePresentations(presentationList: PresentationScheduleModel[]): Observable<ResponseModel<PresentationScheduleModel[]>> {
    return this.http
      .post<ResponseModel<PresentationScheduleModel[]>>(this.serverUrl + this.presentationUrl + 'schedule-presentations', presentationList);
  }

  autoSchedulePresentations(autoScheduleModel: AutoSchedulingModel): Observable<ResponseModel<PresentationScheduleModel[]>> {
    return this.http
      .post<ResponseModel<PresentationScheduleModel[]>>(this.serverUrl + this.presentationUrl + 'auto-schedule', autoScheduleModel);
  }

  syncAllPresentationWithGoogleCalendar(scheduleId: number): Observable<ResponseModel<PresentationModel[]>> {
    const params = new HttpParams().set('scheduleId', scheduleId.toString());
    return this.http
      .get<ResponseModel<PresentationModel[]>>(this.serverUrl + this.presentationUrl + 'sync-google-calendar-all', {params});
  }

  syncPresentationWithGoogleCalendar(presentationId: number): Observable<ResponseModel<PresentationModel>> {
    const params = new HttpParams().set('presentationId', presentationId.toString());
    return this.http
      .get<ResponseModel<PresentationModel>>(this.serverUrl + this.presentationUrl + 'sync-google-calendar', {params});
  }
}
