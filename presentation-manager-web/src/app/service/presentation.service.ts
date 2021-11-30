import {Injectable} from '@angular/core';
import {Constant} from '../../assets/constant/app.constant';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseModel} from '../model/response.model';
import {PresentationModel, PresentationScheduleModel} from '../model/presentation/presentation.model';


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

  schedulePresentations(presentationList: PresentationScheduleModel[]): Observable<ResponseModel<PresentationScheduleModel[]>>{
    return this.http
      .post<ResponseModel<PresentationScheduleModel[]>>(this.serverUrl + this.presentationUrl + 'schedule-presentations', presentationList);
  }
}
