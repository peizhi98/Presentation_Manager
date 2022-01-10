import {CriterionEvaluationModel} from './criterion-evaluation.model';
import {EvaluationType} from './evaluation-form.model';

export class EvaluationModel {
  id: number;
  evaluationFormId: number;
  presentationId: number;
  evaluatorId: number;
  comment: string;
  rating: number;
  criterionEvaluationModelList: CriterionEvaluationModel[];
}


