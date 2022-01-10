import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Constant} from '../../assets/constant/app.constant';
import {ResponseModel} from '../model/auth/response.model';
import {Observable} from 'rxjs';
import {FypEvaluationOverviewModel} from '../model/evaluation/evaluation-report';


@Injectable({
  providedIn: 'root'
})
export class EvaluationReportService {

  private serverUrl = Constant.SERVER_URL;
  private evaluationUrl = '/evaluation-report/';

  constructor(private http: HttpClient) {
  }

  getFypEvaluationReport(scheduleId: number): Observable<ResponseModel<FypEvaluationOverviewModel>> {
    const params = new HttpParams().set('scheduleId', scheduleId.toString());
    return this.http
      .get<ResponseModel<FypEvaluationOverviewModel>>(this.serverUrl + this.evaluationUrl + 'get-report-fyp', {params});
  }
}
