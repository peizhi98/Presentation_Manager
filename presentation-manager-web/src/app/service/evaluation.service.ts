import {Injectable} from '@angular/core';
import {Constant} from '../../assets/constant/app.constant';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseModel} from '../model/auth/response.model';
import {EvaluationModel} from '../model/evaluation/evaluation.model';
import {EvaluationFormModel, EvaluationType} from '../model/evaluation/evaluation-form.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private serverUrl = Constant.SERVER_URL;
  private evaluationUrl = '/evaluation/';

  constructor(private http: HttpClient) {
  }

  evaluate(evaluationModel: EvaluationModel): Observable<ResponseModel<EvaluationModel>> {
    return this.http
      .post<ResponseModel<EvaluationModel>>(this.serverUrl + this.evaluationUrl + 'evaluate', evaluationModel);
  }

  getAuthUserEvaluation(evaluationType: EvaluationType, presentationId: number): Observable<ResponseModel<EvaluationModel>> {
    console.log(evaluationType);
    console.log(presentationId);
    const params = new HttpParams().set('evaluationType', evaluationType.toString()).set('presentationId', presentationId.toString());
    return this.http
      .get<ResponseModel<EvaluationModel>>(this.serverUrl + this.evaluationUrl + 'get-auth-evaluation', {params});
  }
}
