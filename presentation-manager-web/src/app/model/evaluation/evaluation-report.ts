export class FypEvaluationOverviewModel {
  reportWeightage: number;
  presentationWeightage: number;
  total: number;
  fypPresentationEvaluationOverviewModels: FypPresentationEvaluationOverviewModel[];
}

export class FypPresentationEvaluationOverviewModel {
  presentationId: number;
  reportScore: number;
  presentationScore: number;
  total: number;
  studentName: string;
  title: string;
}
