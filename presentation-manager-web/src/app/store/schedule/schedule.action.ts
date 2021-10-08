export class SetScheduleId {
  static readonly type = '[Schedule] Set schedule is';

  constructor(public id: number) {
  }
}

export class ResetScheduleState {
  static readonly type = '[Schedule] Reset schedule state';
}

export class ViewPresentation {
  static readonly type = '[Schedule] View presentation';

  constructor(public payload: number) {
  }
}
