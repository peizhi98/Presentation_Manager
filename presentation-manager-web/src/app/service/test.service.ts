import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ResponseModel} from '../model/auth/response.model';

export class TimeRange {
  startTime: Date;
  endTime: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private serverUrl = 'http://localhost:8080/';
  private testUrl = 'test/';

  constructor(private http: HttpClient) {
  }

  test(): Observable<ResponseModel<string>> {
    console.log('testing...');
    const params = new HttpParams().set('id', 'aaaaaaaaaa');
    const timeRange: TimeRange = new TimeRange();
    timeRange.startTime = new Date();
    timeRange.endTime = new Date();
    timeRange.endTime.setHours(new Date().getHours() + 1);
    console.log(timeRange);
    return this.http.post<ResponseModel<string>>(this.serverUrl + this.testUrl + 'test', timeRange);
  }
}
