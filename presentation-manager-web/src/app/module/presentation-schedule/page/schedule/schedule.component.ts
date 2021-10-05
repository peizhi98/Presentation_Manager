import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ScheduleService} from '../../../../service/schedule.service';
import {Select, Store} from '@ngxs/store';
import {ActivatedRoute} from '@angular/router';
import {ScheduleModel} from '../../../../model/schedule.model';
import {Constant} from '../../../../../assets/constant/app.constant';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable} from 'rxjs';
import {ChangeContentTitle, ViewPresentation} from '../../../../store/schedule/schedule.action';
import {GeneralComponent} from '../../component/general/general.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  scheduleModel: ScheduleModel = new ScheduleModel();
  loading = true;
  contentTitle = '';
  general = false;
  addPresentation = false;
  viewPresentation = false;
  scheduleId: number;


  @Select(ScheduleState.getContentTitle)
  contentTitle$: Observable<string>;

  @ViewChild(GeneralComponent, {static: false}) generalComponent: GeneralComponent;

  constructor(private scheduleService: ScheduleService,
              private activatedRoute: ActivatedRoute, private store: Store) {
  }

  ngOnInit(): void {
    // const scheduleId = this.store.selectSnapshot(ScheduleState.getScheduleId);
    this.contentTitle$.subscribe(state => {
      this.contentTitle = state;
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.scheduleId = params.id;
        this.scheduleService.getSchedule(this.scheduleId).subscribe(resp => {
          if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
            this.scheduleModel = resp.data;
            console.log(resp.data);
            this.loading = false;
          }
        });
      }
    });
  }

  switchGeneral(): void {
    if (this.general) {
      this.generalComponent.switchGeneral();
    }
    this.store.dispatch(new ChangeContentTitle('General'));
    this.addPresentation = false;
    this.general = true;
    this.viewPresentation = false;

  }

  switchAddPresentation(): void {
    this.store.dispatch(new ChangeContentTitle('Add Presentation'));
    this.addPresentation = true;
    this.general = false;
    this.viewPresentation = false;
  }

  switchViewPresentation(presentationId: number): void {
    this.store.dispatch(new ViewPresentation(presentationId));
    this.addPresentation = false;
    this.viewPresentation = true;
    this.general = false;
  }

}
