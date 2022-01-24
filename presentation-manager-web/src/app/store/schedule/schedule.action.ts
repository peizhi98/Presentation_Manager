import {CoordinatorModel} from '../../model/role/coordinator.model';
import {ScheduleType} from '../../model/schedule/schedule.model';

export class SetCurrentSchedule {
  static readonly type = '[Schedule] Set current schedule';

  constructor(public id: number, public coordinatorModel: CoordinatorModel, public type: ScheduleType, public title: string) {
  }
}

export class ResetScheduleState {
  static readonly type = '[Schedule] Reset schedule state';
}


