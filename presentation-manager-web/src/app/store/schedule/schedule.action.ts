export class ViewSchedule {
  static readonly type = '[Schedule] View schedule';
  constructor(public payload: number) {
  }
}

export class ResetScheduleState {
  static readonly type = '[Schedule] Reset schedule state';
}

export class ChangeContentTitle {
  static readonly type = '[Schedule] Change Content Title';
  constructor(public payload: string) {
  }
}

export class ViewPresentation {
  static readonly type = '[Schedule] View presentation';
  constructor(public payload: number) {
  }
}
