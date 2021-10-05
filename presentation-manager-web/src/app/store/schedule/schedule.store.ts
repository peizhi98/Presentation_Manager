import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ChangeContentTitle, ResetScheduleState, ViewPresentation, ViewSchedule} from './schedule.action';
import {Injectable} from '@angular/core';

export class ScheduleStateModel {
  id: number;
  contentTitle: string;
  presentationId: number;
}

export const defaultState = {
  id: null,
  contentTitle: 'General',
  presentationId: null
};

@State<ScheduleStateModel>({
  name: 'schedule',
  defaults: defaultState
})

@Injectable()
export class ScheduleState {
  @Selector()
  public static getScheduleId(state: ScheduleStateModel): number {
    return state.id;
  }

  @Selector()
  public static getContentTitle(state: ScheduleStateModel): string {
    return state.contentTitle;
  }

  @Selector()
  public static getPresentationId(state: ScheduleStateModel): number {
    return state.presentationId;
  }

  @Action(ViewSchedule)
  viewSchedule(ctx: StateContext<ScheduleStateModel>, action: ViewSchedule): void {
    ctx.patchState({
      id: action.payload
    });
  }

  @Action(ChangeContentTitle)
  changeContentTitle(ctx: StateContext<ScheduleStateModel>, action: ChangeContentTitle): void {
    ctx.patchState({
      contentTitle: action.payload
    });
  }

  @Action(ViewPresentation)
  viewPresentation(ctx: StateContext<ScheduleStateModel>, action: ViewPresentation): void {
    ctx.patchState({
      presentationId: action.payload
    });
  }

  @Action(ResetScheduleState)
  resetScheduleState({setState}: StateContext<ResetScheduleState>): void {
    setState({
      ...defaultState
    });
  }
}
