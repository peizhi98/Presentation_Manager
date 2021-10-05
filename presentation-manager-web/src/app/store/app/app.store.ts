import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {ProgressBarLoading, ProgressBarStopLoading, ShowSnackBar} from './app.action';
import {MatSnackBar} from '@angular/material/snack-bar';

export class AppStateModel {
  progressBarLoading: boolean;
}

export const defaultState = {
  progressBarLoading: false,
};

@State<AppStateModel>({
  name: 'app',
  defaults: defaultState
})

@Injectable()
export class AppState {
  constructor(private matSnackBar: MatSnackBar) {
  }

  @Selector()
  public static getProgressBarStatus(state: AppStateModel): boolean {
    return state.progressBarLoading;
  }


  @Action(ProgressBarStopLoading)
  hideProgressBar(ctx: StateContext<AppStateModel>): void {
    ctx.patchState({
      progressBarLoading: false
    });
  }

  @Action(ProgressBarLoading)
  showProgressBar(ctx: StateContext<AppStateModel>): void {
    ctx.patchState({
      progressBarLoading: true
    });
  }

  @Action(ShowSnackBar)
  showSnackBar(ctx: StateContext<AppStateModel>, action: ShowSnackBar): void {
    this.matSnackBar.open(action.message, 'dismiss', {
      duration: (action.duration) ? action.duration : 5000,
      verticalPosition: 'top',
    });
  }


}
