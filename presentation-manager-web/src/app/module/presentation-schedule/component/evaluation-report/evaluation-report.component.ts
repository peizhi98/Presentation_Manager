import {Component, OnInit} from '@angular/core';
import {Select} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable} from 'rxjs';
import {ScheduleType} from '../../../../model/schedule/schedule.model';
import {ChangeEvaluationType} from '../../../../store/evaluation/evaluation.action';

@Component({
  selector: 'app-evaluation-report',
  templateUrl: './evaluation-report.component.html',
  styleUrls: ['./evaluation-report.component.scss']
})
export class EvaluationReportComponent implements OnInit {
  scheduleType: ScheduleType;
  @Select(ScheduleState.getScheduleType)
  scheduleType$: Observable<ScheduleType>;

  constructor() {
  }

  ngOnInit(): void {
    this.scheduleType$.subscribe(type => {
      this.scheduleType = type;
    });
  }

  isFyp(): boolean {
    return this.scheduleType === ScheduleType.FYP;
  }

  isMaster(): boolean {
    return this.scheduleType === ScheduleType.MASTER_DISSERTATION;
  }
}
