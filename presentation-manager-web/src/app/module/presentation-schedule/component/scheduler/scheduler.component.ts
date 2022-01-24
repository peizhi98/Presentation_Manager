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
import {SchedulerPresentationModel} from '../../../../model/presentation/presentation.model';
import {RoomModel, SchedulerRoomPresentationSlotModel} from '../../../../model/room/RoomModel';
import {RoomService} from '../../../../service/room.service';
import {AppState} from '../../../../store/app/app.store';
import {Store} from '@ngxs/store';
import {ShowSnackBar} from '../../../../store/app/app.action';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
  @ViewChild('presentationSlotSchedulerObj') scheduleObj: ScheduleComponent;
  rowAutoHeight = true;
  currentView: View = 'TimelineDay';
  timeFormat = Constant.TIME_FORMAT;
  group: GroupModel = {
    enableCompactView: false,
    resources: ['MeetingRoom']
  };
  allowMultiple = true;
  eventSettings: EventSettingsModel;
  scheduledPresentations: SchedulerPresentationModel[] = [];
  resourceDataSource: RoomModel[];

  constructor(private roomService: RoomService, private store: Store) {
  }

  ngOnInit(): void {
    this.roomService.getAllRooms().subscribe(res => {
      if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
        console.log(res.data);
        this.resourceDataSource = res.data;
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
    args.element.style.backgroundColor = Constant.SCHEDULER_COLOR_1;
  }

  onSchedulerDragStart(args: DragEventArgs): void {
    args.interval = 5;
    args.navigation.enable = true;
  }

  onSchedulerDragStop(args: DragEventArgs): void {
  }

  onResizeStart(args: ResizeEventArgs): void {
    args.interval = 5;
  }

  onResizeStop(args: ResizeEventArgs): void {
    // const start = args.data.startTime;
    // const end = args.data.endTime;
    // (this.eventSettings.dataSource as SchedulerRoomPresentationSlotModel[]).forEach(slot => {
    //   if (slot.startTime.valueOf() === end.valueOf() || (end.valueOf() > slot.startTime && end.valueOf() < slot.endTime)) {
    //     end = slot.endTime;
    //   }
    // });
    console.log(args);
  }

  disablePopupOpen(args): void {
    args.cancel = true;
  }

  onCellClick(args: CellClickEventArgs): void {
    args.cancel = true;
  }

  onEventClick(args: EventClickArgs): void {
  }

  deleteSelectedEvent(): void {
    const eventDetails: Record<string, any> = this.scheduleObj.activeEventData.event as Record<string, any>;
    const currentAction: CurrentAction = 'Delete';
    this.scheduleObj.deleteEvent(eventDetails, currentAction);
    this.scheduleObj.closeQuickInfoPopup();
  }

  public onActionBegin(args: ActionEventArgs): void {
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
