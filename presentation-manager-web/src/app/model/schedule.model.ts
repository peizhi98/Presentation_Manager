import {PresentationModel} from './presentation/presentation.model';
import {CoordinatorModel} from './role/coordinator.model';

export class ScheduleModel {
  id: number;
  year: number;
  sem: number;
  title: string;
  duration: number;
  dateFrom: Date;
  dateTo: Date;
  // timeFrom: Time;
  scheduleType: ScheduleType;
  presentationType: PresentationMode;
  coordinator: CoordinatorModel;
  presentationModels: PresentationModel[];

  constructor() {
    this.presentationModels = [];
    this.coordinator = new CoordinatorModel();
  }
}

export enum ScheduleType {
  FYP = 'FYP',
  MASTER_DISSERTATION = 'MASTER_DISSERTATION'
}

export enum PresentationMode {
  ONLINE = 'ONLINE',
  PHYSICAL = 'PHYSICAL'
}
