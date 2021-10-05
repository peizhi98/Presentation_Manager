import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ResponseModel} from '../model/response.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private serverUrl = 'http://localhost:8080/';
  private testUrl = 'test/';

  constructor(private http: HttpClient) {
  }

  test(): Observable<ResponseModel<string>> {
    const params = new HttpParams().set('id', 'aaaaaaaaaa');
    return this.http.get<ResponseModel<string>>(this.serverUrl + this.testUrl + 'test', {params});
  }
}
