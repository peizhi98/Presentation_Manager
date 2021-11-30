import {CriteriaModel} from './criteria.model';

export class EvaluationFormModel {
  id: number;
  scheduleId: number;
  evaluationType: EvaluationType;
  maxGap: number;
  rubricUrl: string;
  criteriaModels: CriteriaModel[];
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

