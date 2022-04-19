import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable, Subscription} from 'rxjs';
import {ScheduleType} from '../../../../model/schedule/schedule.model';
import {ChangeEvaluationType} from '../../../../store/evaluation/evaluation.action';

@Component({
  selector: 'app-evaluation-report',
  templateUrl: './evaluation-report.component.html',
  styleUrls: ['./evaluation-report.component.scss']
})
export class EvaluationReportComponent implements OnInit, OnDestroy {
  scheduleType: ScheduleType;
  @Select(ScheduleState.getScheduleType)
  scheduleType$: Observable<ScheduleType>;
  subs: Subscription[] = [];

  constructor() {
  }
  ngOnDestroy(): void {
    this.subs.forEach(s => {
      s.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.subs.push(this.scheduleType$.subscribe(type => {
      this.scheduleType = type;
    }));
  }

  isFyp(): boolean {
    return this.scheduleType === ScheduleType.FYP;
  }

  isMaster(): boolean {
    return this.scheduleType === ScheduleType.MASTER_DISSERTATION;
  }
}
