export class FypEvaluationOverviewModel {
  reportWeightage: number;
  presentationWeightage: number;
  total: number;
  fypPresentationEvaluationOverviewModels: FypPresentationEvaluationOverviewModel[];
}

export class FypPresentationEvaluationOverviewModel {
  presentationId: number;
  studentName: string;
  matrix: string;
  title: string;
  numberOfPanels: number;
  numberOfPanelsEvaluated: number;
  highestEvaluationGivenByPanel: number;
  lowestEvaluationGivenByPanel: number;
  maxDifferenceInEvaluation: number;
  reportScore: number;
  presentationScore: number;
  total: number;
  totalInPercent: number;
}

export class MasterEvaluationOverviewModel {
  panelEvaluationWeightage: number;
  total: number;
  masterPresentationEvaluationOverviewModels: MasterPresentationEvaluationOverviewModel[];
}

export class MasterPresentationEvaluationOverviewModel {
  presentationId: number;
  studentName: string;
  matrix: string;
  title: string;
  numberOfPanels: number;
  numberOfPanelsEvaluated: number;
  highestEvaluationGivenByPanel: number;
  lowestEvaluationGivenByPanel: number;
  maxDifferenceInEvaluation: number;
  confirmationResult: number;
  avgPanelEvaluationScore: number;
  total: number;
  totalInPercent: number;
}

export class CriterionEvaluationReportModel {
  criterionId: number;
  valuationFormId: number;
  name: string;
  weightage: number;
  scale: number;
  position: number;
  evaluatorCriterionEvaluationModels: EvaluatorCriterionEvaluationModel[];
}

export class EvaluatorCriterionEvaluationModel {
  comment: string;
  rating: number;
  weightageOfCriterion: number;
  score: number;
  evaluatorName: string;
  evaluatorId: number;
}
