import {CriterionModel} from './criterion.model';

export class CriterionEvaluationModel {
  id: number;
  evaluationId: number;
  criterionModel: CriterionModel;
  comment: string;
  rating: number;
}
