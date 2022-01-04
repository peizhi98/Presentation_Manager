import {CoordinatorModel} from '../../model/role/coordinator.model';

export class SetCurrentSchedule {
  static readonly type = '[Schedule] Set current schedule';

  constructor(public id: number, public coordinatorModel: CoordinatorModel) {
  }
}

export class ResetScheduleState {
  static readonly type = '[Schedule] Reset schedule state';
}


