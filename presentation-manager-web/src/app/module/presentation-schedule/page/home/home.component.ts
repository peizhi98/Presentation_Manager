import {Component, OnInit} from '@angular/core';
import {ScheduleService} from '../../../../service/schedule.service';
import {Constant} from '../../../../../assets/constant/app.constant';
import {ScheduleModel} from '../../../../model/schedule.model';
import {Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {RouteConstant} from '../../../../../assets/constant/route.contant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dialog = false;
  scheduleList: ScheduleModel[] = [];

  constructor(private scheduleService: ScheduleService, private router: Router, private store: Store) {
  }

  ngOnInit(): void {
    this.scheduleService.getSchedules().subscribe(resp => {
      if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
        console.log(resp);
        this.scheduleList = resp.data;
      }

    });
  }


  dispatchViewSchedule(id: number): void {
    // this.store.dispatch(new ViewSchedule(id));
    console.log('aaaaaaaaaaaaa');
    this.router.navigate(['schedule/manage'], {queryParams: {id: id}});
  }

}
