import {PanelModel} from '../role/panel.model';
import {SupervisorModel} from '../role/supervisor.model';
import {ScheduleModel} from '../schedule/schedule.model';

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
  roomId: number;
  venue: string;
  scheduleModel: ScheduleModel;
  supervisorModel: SupervisorModel;
  panelModels: PanelModel[];

  constructor() {
    this.supervisorModel = new SupervisorModel();
  }
}

export class PresentationScheduleModel {
  id: number;
  startTime: Date;
  endTime: Date;
  roomId: number;

}

export class SchedulerPresentationModel extends PresentationModel {
  schedulerId: number | string;
  roomId: number;
  scheduleSaved: boolean;
}
