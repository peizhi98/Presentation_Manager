export class ProgressBarLoading {
  static readonly type = '[App] Progress Bar Loading';
}

export class ProgressBarStopLoading {
  static readonly type = '[App] Hide Progress Bar Stop Loading';
}

export class ShowSnackBar {
  static readonly type = '[App] Show Snack Bar';

  constructor(public message: string, public duration?: number) {
  }
}

export class ReloadData {
  static readonly type = '[App] Reload Data';
}

