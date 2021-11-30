import {Constant} from '../../assets/constant/app.constant';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseModel} from '../model/response.model';
import {EvaluationFormModel, EvaluationType} from '../model/evaluation-form.model';


@Injectable({
  providedIn: 'root'
})
export class EvaluationFormService {

  private serverUrl = Constant.SERVER_URL;
  private evaluationFormUrl = '/evaluation-form/';

  constructor(private http: HttpClient) {
  }

  getEvaluationForm(scheduleId: number, evaluationType: EvaluationType): Observable<ResponseModel<EvaluationFormModel>> {
    const params = new HttpParams().set('scheduleId', scheduleId.toString()).set('evaluationType', evaluationType.toString());
    return this.http
      .get<ResponseModel<EvaluationFormModel>>(this.serverUrl + this.evaluationFormUrl + 'get-evaluation-form', {params});
  }

  addOrEditEvaluationForm(evaluationFormModel: EvaluationFormModel): Observable<ResponseModel<EvaluationFormModel>> {
    return this.http
      .post<ResponseModel<EvaluationFormModel>>(this.serverUrl + this.evaluationFormUrl + 'add-edit-evaluation-form', evaluationFormModel);
  }
}
