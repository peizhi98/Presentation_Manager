import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {ResetScheduleState, SetCurrentSchedule} from './schedule.action';
import {Injectable} from '@angular/core';
import {CoordinatorModel} from '../../model/role/coordinator.model';
import {AuthState} from '../auth/auth.store';
import {UserModel} from '../../model/user/user.model';
import {ChangeScheduleRole} from '../user-role/user-role.action';
import {Constant} from '../../../assets/constant/app.constant';
import {ScheduleType} from '../../model/schedule/schedule.model';

export class ScheduleStateModel {
  id: number;
  coordinator: CoordinatorModel;
  type: ScheduleType;
  title: string;
}

export const defaultState = {
  id: null,
  coordinator: null,
  type: null,
  title: null
};

@State<ScheduleStateModel>({
  name: 'schedule',
  defaults: defaultState
})

@Injectable()
export class ScheduleState {
  constructor(private store: Store) {
  }

  @Selector()
  public static getScheduleId(state: ScheduleStateModel): number {
    return state.id;
  }

  @Selector()
  public static getScheduleType(state: ScheduleStateModel): ScheduleType {
    return state.type;
  }

  @Selector()
  public static getScheduleTitle(state: ScheduleStateModel): string {
    return state.title;
  }


  @Action(SetCurrentSchedule)
  setCurrentSchedule(ctx: StateContext<ScheduleStateModel>, action: SetCurrentSchedule): void {
    // set permission
    console.log(action);
    const user: UserModel = this.store.selectSnapshot(AuthState.getUser);
    if (action.coordinatorModel.id === user.id) {
      this.store.dispatch(new ChangeScheduleRole([Constant.ROLE_SCHEDULE_COORDINATOR]));
    }
    ctx.patchState({
      id: action.id,
      coordinator: action.coordinatorModel,
      type: action.type,
      title: action.title
    });
  }

  @Action(ResetScheduleState)
  resetScheduleState({setState}: StateContext<ResetScheduleState>): void {
    this.store.dispatch(new ChangeScheduleRole([]));
    setState({
      ...defaultState
    });
  }
}
