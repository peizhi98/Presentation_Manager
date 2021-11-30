export class SetCurrentSchedule {
  static readonly type = '[Schedule] Set current schedule';

  constructor(public id: number) {
  }
}

export class ResetScheduleState {
  static readonly type = '[Schedule] Reset schedule state';
}


