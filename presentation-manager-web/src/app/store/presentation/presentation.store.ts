import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {SetCurrentPresentation} from './presentation.action';
import {PanelModel} from '../../model/role/panel.model';
import {SupervisorModel} from '../../model/role/supervisor.model';
import {UserModel} from '../../model/user/user.model';
import {AuthState} from '../auth/auth.store';
import {Constant} from '../../../assets/constant/app.constant';
import {ChangePresentationRole} from '../user-role/user-role.action';

export class PresentationStateModel {
  presentationId: number;
  panels: PanelModel[];
  supervisor: SupervisorModel;
}

export const defaultState = {
  presentationId: null,
  panels: [],
  supervisor: new SupervisorModel()
};

@State<PresentationStateModel>({
  name: 'presentation',
  defaults: defaultState
})

@Injectable()
export class PresentationState {
  constructor(private store: Store) {
  }

  @Selector()
  public static getPresentationId(state: PresentationStateModel): number {
    return state.presentationId;
  }

  @Action(SetCurrentPresentation)
  setCurrentPresentation(ctx: StateContext<PresentationStateModel>, action: SetCurrentPresentation): void {
    const user: UserModel = this.store.selectSnapshot(AuthState.getUser);
    const roles: string[] = [];
    if (action.supervisor && action.supervisor.id === user.id) {
      roles.push(Constant.ROLE_SUPERVISOR);
    }
    if (action.panels) {
      action.panels.forEach(p => {
        if (p.id === user.id) {
          roles.push(Constant.ROLE_PANEL);
        }
      });
    }
    this.store.dispatch(new ChangePresentationRole(roles));
    ctx.patchState({
      presentationId: action.id,
      panels: action.panels,
      supervisor: action.supervisor
    });
  }

}
