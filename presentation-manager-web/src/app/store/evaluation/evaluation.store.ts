import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {EvaluationFormMode, EvaluationType} from '../../model/evaluation-form.model';
import {ChangeEvaluationFormMode, ChangeEvaluationType, ResetEvaluationState} from './evaluation.action';

export class EvaluationStateModel {
  evaluationType: EvaluationType;
  evaluationFormMode: EvaluationFormMode;
}

export const defaultState = {
  evaluationType: null,
  evaluationFormMode: EvaluationFormMode.VIEW
};

@State<EvaluationStateModel>({
  name: 'Evaluation',
  defaults: defaultState
})

@Injectable()
export class EvaluationState {

  @Selector()
  public static getEvaluationType(state: EvaluationStateModel): EvaluationType {
    return state.evaluationType;
  }

  @Selector()
  public static getEvaluationFormMode(state: EvaluationStateModel): EvaluationFormMode {
    return state.evaluationFormMode;
  }


  @Action(ChangeEvaluationType)
  changeEvaluationType(ctx: StateContext<EvaluationStateModel>, action: ChangeEvaluationType): void {
    ctx.patchState({
      evaluationType: action.evaluationType
    });
  }

  @Action(ChangeEvaluationFormMode)
  changeEvaluationFormMode(ctx: StateContext<EvaluationStateModel>, action: ChangeEvaluationFormMode): void {
    ctx.patchState({
      evaluationFormMode: action.evaluationFormMode
    });
  }

  @Action(ResetEvaluationState)
  resetScheduleState({setState}: StateContext<ResetEvaluationState>): void {
    setState({
      ...defaultState
    });
  }

}
