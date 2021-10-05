import {PresentationModel} from './presentation/presentation.model';
import {CoordinatorModel} from './role/coordinator.model';

export class ScheduleModel {
  id: number;
  coordinatorId: string;
  year: number;
  sem: number;
  title: string;
  duration: number;
  dateFrom: Date;
  dateTo: Date;
  // timeFrom: Time;
  scheduleType: ScheduleType;
  presentationType: PresentationType;
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

export enum PresentationType {
  ONLINE = 'ONLINE',
  F2F = 'F2F'
}
