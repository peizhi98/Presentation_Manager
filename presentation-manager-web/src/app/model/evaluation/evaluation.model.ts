import {CriterionEvaluationModel} from './criterion-evaluation.model';

export class EvaluationModel {
  id: number;
  evaluationFormId: number;
  presentationId: number;
  evaluatorId: number;
  comment: string;
  rating: number;
  rubricUrl: string;
  criterionEvaluationModelList: CriterionEvaluationModel[];
}


