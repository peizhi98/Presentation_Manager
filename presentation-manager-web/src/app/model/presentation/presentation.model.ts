import {PanelModel} from '../role/panel.model';
import {SupervisorModel} from '../role/supervisor.model';

export class PresentationModel {
  id: number;
  supervisorId: number;
  studentName: string;
  studentEmail: string;
  scheduleId: number;
  title: string;
  mark: number;
  resultStatus: string;
  startTime: Date;
  endTime: Date;
  venueId: number;
  supervisorModel: SupervisorModel;
  panelModels: PanelModel[];

  constructor() {
    this.supervisorModel = new SupervisorModel();
  }
}
