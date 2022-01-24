import {Injectable} from '@angular/core';
import {Constant} from '../../assets/constant/app.constant';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseModel} from '../model/auth/response.model';
import {PresentationModel} from '../model/presentation/presentation.model';
import {RoomModel} from '../model/room/RoomModel';

@Injectable({
  providedIn: 'root'
})
export class RoomService{
  private serverUrl = Constant.SERVER_URL;
  private presentationUrl = '/room/';

  constructor(private http: HttpClient) {
  }

  getAllRooms(): Observable<ResponseModel<RoomModel[]>> {
    return this.http
      .get<ResponseModel<RoomModel[]>>(this.serverUrl + this.presentationUrl + 'get-all');
  }
}
