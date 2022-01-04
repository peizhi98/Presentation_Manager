import {Component, OnInit} from '@angular/core';
import {ScheduleService} from '../../../../service/schedule.service';
import {Store} from '@ngxs/store';
import {ActivatedRoute, Router} from '@angular/router';
import {ScheduleModel} from '../../../../model/schedule.model';
import {Constant} from '../../../../../assets/constant/app.constant';
import {RouteConstant} from '../../../../../assets/constant/route.contant';
import {SetCurrentSchedule} from '../../../../store/schedule/schedule.action';
import {AuthState} from '../../../../store/auth/auth.store';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  navLinks = [];
  activeLinkIndex = -1;
  scheduleModel: ScheduleModel;
  loading = true;
  contentTitle = '';
  scheduleId: number;
  constant = Constant;

  constructor(private scheduleService: ScheduleService,
              private activatedRoute: ActivatedRoute, private store: Store, private router: Router) {
    this.navLinks = [
      {
        label: 'Presentation',
        link: RouteConstant.PRESENTATION_VIEW,
        index: 0
      }, {
        label: 'Timetable',
        link: RouteConstant.TIMETABLE,
        index: 1
      },
      // {
      //   label: 'Evaluation',
      //   link: 'RouteConstant.CRITERIA',
      //   index: 2
      // },
      {
        label: 'Evaluation Criteria',
        link: RouteConstant.CRITERIA,
        index: 2
      },
      {
        label: 'Evaluation Report',
        link: RouteConstant.EVALUATION_VIEW,
        index: 3
      },
      // {
      //   label: 'Details',
      //   link: './details',
      //   index: 5
      // },
    ];
  }

  ngOnInit(): void {
    // this.router.events.subscribe((res) => {
    //   this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    // });
    console.log(
      this.store.selectSnapshot(AuthState.getUser));
    this.activatedRoute.params.subscribe(params => {
      if (params) {
        this.scheduleId = params.id;
        this.scheduleService.getSchedule(this.scheduleId).subscribe(resp => {
          if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
            this.store.dispatch(new SetCurrentSchedule(this.scheduleId, resp.data.coordinator));
            this.scheduleModel = resp.data;
            console.log(resp.data);
            this.loading = false;
          }
        });
      }
    });
  }

}
