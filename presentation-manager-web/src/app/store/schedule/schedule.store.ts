import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ResetScheduleState, SetScheduleId, ViewPresentation} from './schedule.action';
import {Injectable} from '@angular/core';

export class ScheduleStateModel {
  id: number;
  presentationId: number;
}

export const defaultState = {
  id: null,
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
  public static getPresentationId(state: ScheduleStateModel): number {
    return state.presentationId;
  }

  @Action(SetScheduleId)
  setScheduleId(ctx: StateContext<ScheduleStateModel>, action: SetScheduleId): void {
    ctx.patchState({
      id: action.id
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
