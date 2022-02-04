import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Constant} from '../../assets/constant/app.constant';
import {ResponseModel} from '../model/auth/response.model';
import {Observable} from 'rxjs';
import {
  CriterionEvaluationReportModel,
  FypEvaluationOverviewModel,
  MasterEvaluationOverviewModel
} from '../model/evaluation/evaluation-report';
import {EvaluationType} from '../model/evaluation/evaluation-form.model';


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

  getMasterEvaluationReport(scheduleId: number): Observable<ResponseModel<MasterEvaluationOverviewModel>> {
    const params = new HttpParams().set('scheduleId', scheduleId.toString());
    return this.http
      .get<ResponseModel<MasterEvaluationOverviewModel>>(this.serverUrl + this.evaluationUrl + 'get-report-master', {params});
  }

  getPresentationEvaluationsOfType(evaluationType: EvaluationType, presentationId: number): Observable<ResponseModel<CriterionEvaluationReportModel[]>> {
    const params = new HttpParams().set('evaluationType', evaluationType.toString()).set('presentationId', presentationId.toString());
    return this.http
      .get<ResponseModel<CriterionEvaluationReportModel[]>>(this.serverUrl + this.evaluationUrl + 'get-presentation-evaluation-of-type', {params});
  }
}
