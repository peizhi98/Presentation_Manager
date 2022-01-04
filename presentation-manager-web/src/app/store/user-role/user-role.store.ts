import {Action, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {ChangePresentationRole, ChangeScheduleRole} from './user-role.action';
import {NgxPermissionsService} from 'ngx-permissions';

export class UserRoleStateModel {
  scheduleRoles: string[];
  presentationRoles: string[];
}

export const defaultState = {
  scheduleRoles: [],
  presentationRoles: []
};

@State<UserRoleStateModel>({
  name: 'userRole',
  defaults: defaultState
})

@Injectable()
export class UserRoleState {
  constructor(private permissionsService: NgxPermissionsService) {
  }

  @Action(ChangeScheduleRole)
  changeScheduleRole(ctx: StateContext<UserRoleStateModel>, action: ChangeScheduleRole): void {
    ctx.getState().scheduleRoles.forEach(role => {
      this.permissionsService.removePermission(role);
    });
    this.permissionsService.addPermission(action.roles);
    ctx.patchState({
      scheduleRoles: action.roles
    });
  }

  @Action(ChangePresentationRole)
  changePresentationRole(ctx: StateContext<UserRoleStateModel>, action: ChangePresentationRole): void {
    ctx.getState().presentationRoles.forEach(role => {
      this.permissionsService.removePermission(role);
    });
    this.permissionsService.addPermission(action.roles);
    ctx.patchState({
      presentationRoles: action.roles
    });
  }
}
