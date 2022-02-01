import {PanelModel} from '../role/panel.model';
import {SupervisorModel} from '../role/supervisor.model';
import {PresentationMode, ScheduleModel} from '../schedule/schedule.model';
import {TimeRange} from '../../service/test.service';
import {RoomPresentationSlotsModel} from '../room/RoomModel';

export class PresentationModel {
  id: number;
  supervisorId: number;
  studentName: string;
  studentMatrixNo: string;
  studentEmail: string;
  scheduleId: number;
  scheduleTitle: string;
  title: string;
  mark: number;
  resultStatus: string;
  startTime: Date;
  endTime: Date;
  roomId: number;
  roomName: string;
  venue: string;
  mode: PresentationMode;
  scheduleModel: ScheduleModel;
  supervisorModel: SupervisorModel;
  chairperson: PanelModel;
  panelModels: PanelModel[];
  commonAvailabilityList: TimeRange[];

  //google
  calendarId: string;
  calendarHtmlLink: string;
  lastSync: Date;
  googleMeetLink: string;
  calendarStartTime: Date;
  calendarEndTime: Date;

  constructor() {
    this.supervisorModel = new SupervisorModel();
    this.chairperson = new PanelModel();
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
  isBlock: boolean;
}

export class PresentationModeCheckModel extends PresentationModel {
  online: boolean;
  physical: boolean;
}

export class AutoSchedulingModel {
  scheduleId: number;
  presentationsToScheduleOnline: PresentationModel[];
  presentationsToSchedulePhysical: PresentationModel[];
  considerAvailability: boolean;
  roomPresentationSlotsModels: RoomPresentationSlotsModel[];
  onlinePresentationSlotsModel: RoomPresentationSlotsModel;
  presentationDuration: number;
}

export class SchedulerModel {
  presentationToSchedule: PresentationModel[];
  unAvailableTime: PresentationModel[];
}
