import {TimeRange} from '../../service/test.service';

export class RoomModel {
  id: number;
  name: string;
}

export class RoomPresentationSlotsModel {
  id: number;
  name: string;
  slots: TimeRange[];
}

export class SchedulerRoomPresentationSlotModel {
  schedulerId: number;
  roomId: number;
  subject = 'Presentation Slot';
  roomName: string;
  name: string;
  startTime: Date;
  endTime: Date;
  isBlock: boolean;
  titleOfScheduleBlock: string;

}
