import {CriterionModel} from './criterion.model';

export class EvaluationFormModel {
  id: number;
  scheduleId: number;
  evaluationType: EvaluationType;
  maxGap: number;
  rubricUrl: string;
  criterionModels: CriterionModel[];
}

export enum EvaluationType {
  // PRESENTATION = 'Presentation',
  // REPORT = 'Report',
  // PANEL = 'Panel',
  // CHAIRPERSON = 'Chairperson'
  PRESENTATION = 'PRESENTATION',
  REPORT = 'REPORT',
  PANEL = 'PANEL',
  CHAIRPERSON = 'CHAIRPERSON'
}

export enum EvaluationFormMode {
  VIEW = 'View',
  EDIT = 'Edit',
  EVALUATE = 'Evaluate'
}

