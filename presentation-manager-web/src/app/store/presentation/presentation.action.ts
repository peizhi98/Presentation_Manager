export class SetCurrentPresentation {
  static readonly type = '[Presentation] Set current presentation';

  constructor(public payload: number) {
  }
}
