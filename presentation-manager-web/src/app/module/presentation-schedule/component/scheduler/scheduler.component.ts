import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {
  ActionEventArgs,
  CellClickEventArgs,
  CurrentAction,
  DragEventArgs,
  EventClickArgs,
  EventRenderedArgs,
  EventSettingsModel,
  GroupModel,
  ResizeEventArgs,
  ResourceDetails,
  ScheduleComponent,
  View
} from '@syncfusion/ej2-angular-schedule';
import {Constant} from '../../../../../assets/constant/app.constant';
import {RoomModel, SchedulerRoomPresentationSlotModel} from '../../../../model/room/RoomModel';
import {RoomService} from '../../../../service/room.service';
import {Store} from '@ngxs/store';
import {ShowSnackBar} from '../../../../store/app/app.action';
import {PresentationService} from '../../../../service/presentation.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
  @ViewChild('presentationSlotSchedulerObj') scheduleObj: ScheduleComponent;
  rowAutoHeight = true;
  startHour = Constant.SCHEDULER_START_HOUR;
  endHour = Constant.SCHEDULER_END_HOUR;
  currentView: View = 'TimelineDay';
  timeFormat = Constant.TIME_FORMAT;
  group: GroupModel = {
    enableCompactView: false,
    resources: ['MeetingRoom']
  };
  allowMultiple = true;
  eventSettings: EventSettingsModel;
  resourceDataSource: RoomModel[];

  constructor(private roomService: RoomService, private store: Store, private presentationService: PresentationService) {
  }

  ngOnInit(): void {
    this.eventSettings = {
      fields: {
        id: 'schedulerId',
        subject: {name: 'subject'},
        startTime: {name: 'startTime', title: 'From'},
        endTime: {name: 'endTime', title: 'To'}
      },
      enableTooltip: true
    };
    this.eventSettings.dataSource = [];
    this.roomService.getAllRooms().subscribe(res => {
      if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
        console.log(res.data);
        this.resourceDataSource = res.data;
      }
    });
    this.presentationService.getAllPresentationsAfterNow().subscribe(res => {
      if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
        res.data.forEach((presentationData, index) => {
          if (presentationData.roomName !== 'Online') {
            const blockedSlot: SchedulerRoomPresentationSlotModel = new SchedulerRoomPresentationSlotModel();
            blockedSlot.startTime = presentationData.startTime;
            blockedSlot.endTime = presentationData.endTime;
            blockedSlot.roomId = presentationData.roomId;
            blockedSlot.roomName = presentationData.roomName;
            blockedSlot.subject = 'Unavailable';
            blockedSlot.isBlock = true;
            blockedSlot.titleOfScheduleBlock = presentationData.scheduleModel.title;
            this.addToScheduler(blockedSlot);
          }

        });
      }
    });
  }

  @HostListener('click', ['$event'])
  handleCellClick(event): void {
    console.log(event);
    if (event.target.classList.contains('e-work-cells')) {
      const cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(event.target);
      if (cellData) {
        const mtSlot: SchedulerRoomPresentationSlotModel = new SchedulerRoomPresentationSlotModel();
        const resourceDetails: ResourceDetails = this.scheduleObj.getResourcesByIndex(cellData.groupIndex);
        mtSlot.startTime = cellData.startTime;
        mtSlot.endTime = cellData.endTime;
        mtSlot.roomId = resourceDetails.resourceData.id;
        mtSlot.roomName = resourceDetails.resourceData.name;
        this.addToScheduler(mtSlot);
      }
    }
  }

  addToScheduler(data): void {
    data.schedulerId = this.scheduleObj.getEventMaxID();
    this.scheduleObj.addEvent(data);
  }

  onEventRendered(args: EventRenderedArgs): void {
    if (args.data.isBlock) {
      args.element.style.backgroundColor = '#616161';
      return;
    }
    args.element.style.backgroundColor = Constant.SCHEDULER_COLOR_1;
  }

  onSchedulerDragStart(args: DragEventArgs): void {
    args.interval = 5;
    args.navigation.enable = true;
    let eventData: any = null;
    if (args.data && args.data[0]) {
      eventData = args.data[0];
    } else if (args.data) {
      eventData = args.data;
    }
    if (eventData && eventData.isBlock) {
      args.cancel = true;
      return;
    }
  }

  onSchedulerDragStop(args: DragEventArgs): void {
  }

  onResizeStart(args: ResizeEventArgs): void {
    args.interval = 5;
    let eventData: any = null;
    if (args.data && args.data[0]) {
      eventData = args.data[0];
    } else if (args.data) {
      eventData = args.data;
    }
    if (eventData && eventData.isBlock) {
      args.cancel = true;
      return;
    }
  }

  onResizeStop(args: ResizeEventArgs): void {
  }

  disablePopupOpen(args): void {
    args.cancel = true;
  }

  onEventClick(args: EventClickArgs): void {
    console.log(args);
    if ((args.event as SchedulerRoomPresentationSlotModel).isBlock) {
      args.cancel = true;
    }
  }

  deleteSelectedEvent(): void {
    const eventDetails: Record<string, any> = this.scheduleObj.activeEventData.event as Record<string, any>;
    const currentAction: CurrentAction = 'Delete';
    this.scheduleObj.deleteEvent(eventDetails, currentAction);
    this.scheduleObj.closeQuickInfoPopup();
  }

  public onActionBegin(args: ActionEventArgs): void {
    console.log(args);
    if (
      (args.requestType === 'eventCreate' ||
        args.requestType === 'eventChange')
    ) {
      const eventData: any = args.data[0]
        ? args.data[0]
        : args.data;
      if (!this.scheduleObj.isSlotAvailable(eventData)) {
        args.cancel = true;
        this.store.dispatch(new ShowSnackBar('Overlapping presentation slot is not allowed.'));
      }

    }
  }

}
