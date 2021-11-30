import {EvaluationFormMode, EvaluationType} from '../../model/evaluation-form.model';

export class ChangeEvaluationType {
  static readonly type = '[Evaluation] Change Evaluation Type';
  constructor(public evaluationType: EvaluationType) {
  }
}

export class ChangeEvaluationFormMode {
  static readonly type = '[Evaluation] Change Evaluation Form Mode';
  constructor(public evaluationFormMode: EvaluationFormMode) {
  }
}

export class ResetEvaluationState {
  static readonly type = '[Evaluation] Reset Evaluation state';
}


