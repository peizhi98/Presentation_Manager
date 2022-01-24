import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {PatchUserFromBackend} from './user.action';
import {LecturerModel} from '../../model/role/lecturer.model';
import {UserService} from '../../service/user.service';
import {Constant} from '../../../assets/constant/app.constant';

export class UserStateModel {
  lecturers: LecturerModel[];
}

export const defaultState = {
  lecturers: [],
};

@State<UserStateModel>({
  name: 'user',
  defaults: defaultState
})

@Injectable()
export class UserState {
  constructor(private userService: UserService) {
  }

  @Selector()
  public static getLecturer(state: UserStateModel): LecturerModel[] {
    return state.lecturers;
  }

  @Action(PatchUserFromBackend)
  patchLecturerFromBackend(ctx: StateContext<UserStateModel>): void {
    if (ctx.getState().lecturers.length < 1) {
      this.userService.getAllLecturers().subscribe(resp => {
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          console.log('patch lecturer');
          ctx.patchState({
            lecturers: resp.data
          });
        }
      });
    }
  }

}
