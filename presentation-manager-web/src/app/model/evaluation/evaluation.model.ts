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

export class FYPEvaluationReportModel {
  presentationId: number;
  studentName: string;
  title: string;
  mark: number;
  reportEvaluation: EvaluationModel;
  presentationEvaluations: EvaluationModel[];
}

export class EvaluationReportModel {
  evaluationId: number;
  mark: number;
  evaluationType: EvaluationType;
  evaluatorId: number;
  evaluatorName: string;
}
