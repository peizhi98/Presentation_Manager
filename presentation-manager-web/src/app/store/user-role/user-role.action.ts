export class ChangeScheduleRole {
  static readonly type = '[User Role] Change Schedule Role';
  constructor(public roles: string[]) {
  }
}

export class ChangePresentationRole {
  static readonly type = '[User Role] Change Presentation Role';
  constructor(public roles: string[]) {
  }
}
