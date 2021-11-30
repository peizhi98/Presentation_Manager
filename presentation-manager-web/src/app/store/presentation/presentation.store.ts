import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {SetCurrentPresentation} from './presentation.action';

export class PresentationStateModel {
  presentationId: number;
}

export const defaultState = {
  presentationId: null,
};

@State<PresentationStateModel>({
  name: 'presentation',
  defaults: defaultState
})

@Injectable()
export class PresentationState {
  @Selector()
  public static getPresentationId(state: PresentationStateModel): number {
    return state.presentationId;
  }

  @Action(SetCurrentPresentation)
  setCurrentPresentation(ctx: StateContext<PresentationStateModel>, action: SetCurrentPresentation): void {
    ctx.patchState({
      presentationId: action.payload
    });
  }

}
