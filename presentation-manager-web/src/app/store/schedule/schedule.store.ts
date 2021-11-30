import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ResetScheduleState, SetCurrentSchedule} from './schedule.action';
import {Injectable} from '@angular/core';

export class ScheduleStateModel {
  id: number;
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



  @Action(SetCurrentSchedule)
  setCurrentSchedule(ctx: StateContext<ScheduleStateModel>, action: SetCurrentSchedule): void {
    ctx.patchState({
      id: action.id
    });
  }



  @Action(ResetScheduleState)
  resetScheduleState({setState}: StateContext<ResetScheduleState>): void {
    setState({
      ...defaultState
    });
  }
}
