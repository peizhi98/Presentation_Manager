import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ActionEventArgs,
  CellClickEventArgs,
  CurrentAction,
  DragEventArgs,
  EventClickArgs,
  EventRenderedArgs,
  EventSettingsModel,
  ResizeEventArgs,
  ScheduleComponent,
  View
} from '@syncfusion/ej2-angular-schedule';
import {AvailabilityModel, SchedulerAvailabilityModel} from '../../../../model/availability/availability.model';
import {Store} from '@ngxs/store';
import {AvailabilityService} from '../../../../service/availability.service';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {Constant} from '../../../../../assets/constant/app.constant';
import {ShowSnackBar} from '../../../../store/app/app.action';

@Component({
  selector: 'app-manage-availability',
  templateUrl: './manage-availability.component.html',
  styleUrls: ['./manage-availability.component.css']
})
export class ManageAvailabilityComponent implements OnInit {
  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
  startHour = Constant.SCHEDULER_START_HOUR;
  endHour = Constant.SCHEDULER_END_HOUR;
  public setView: View = 'Week';
  public showQuickInfo = false;
  public availabilityModels: SchedulerAvailabilityModel[] = [];
  public selectedDate: Date = new Date();
  public dataSource: Record<string, any>[] = [];
  public eventSettings: EventSettingsModel;
  public slotData: SchedulerAvailabilityModel = new SchedulerAvailabilityModel(new AvailabilityModel());

  constructor(private availabilityService: AvailabilityService, private store: Store, private dialogUtil: LoadingDialogUtil) {
  }

  ngOnInit(): void {
    const dialogRef = this.dialogUtil.openLoadingDialog();
    this.availabilityService.getAvailabilities().subscribe(resp => {
      if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
        resp.data.forEach(a => {
          const displayModel = new SchedulerAvailabilityModel(a as AvailabilityModel);
          // displayModel.startTime = new Date(2021, 9, 4, 13, 0);
          // displayModel.endTime = new Date(2021, 9, 4, 16, 0);
          this.availabilityModels.push(displayModel);
        });
        this.eventSettings = {
          fields: {
            id: 'schedulerId',
            subject: {name: 'subject'},
            startTime: {name: 'startTime', validation: {required: true}},
            endTime: {name: 'endTime', validation: {required: true}},
            isBlock: 'isBlock'
          },
          enableTooltip: true
        };
        this.eventSettings.dataSource = this.availabilityModels;
        dialogRef.close();
      }
    });
  }

  onActionComplete(args: ActionEventArgs): void {
    console.log(this.eventSettings);
    console.log(args);
  }

  onDragStart(args: DragEventArgs): void {
    args.interval = 5;
    args.navigation.enable = true;
  }

  onResizeStart(args: ResizeEventArgs): void {
    args.interval = 5;
  }

  // startDateParser(data): Date {
  //   if (!isNullOrUndefined(data)) {
  //     return new Date(data);
  //   } else if (!isNullOrUndefined(this.slotData.startTime)) {
  //     return new Date(this.slotData.startTime);
  //   }
  // }
  //
  // endDateParser(data): Date {
  //   if (!isNullOrUndefined(data)) {
  //     return new Date(data);
  //   } else if (!isNullOrUndefined(this.slotData.endTime)) {
  //     return new Date(this.slotData.endTime);
  //   }
  // }

  onEventClick(args: EventClickArgs): void {
    this.slotData = args.event as SchedulerAvailabilityModel;
  }

  addSlotData(): void {
    console.log(this.slotData);
    if (this.slotData.startTime && this.slotData.endTime) {
      this.slotData.schedulerId = this.scheduleObj.getEventMaxID();
      this.scheduleObj.addEvent(this.slotData);
      this.scheduleObj.closeQuickInfoPopup();
    }

  }

  deleteSelectedEvent(): void {
    const eventDetails: Record<string, any> = this.scheduleObj.activeEventData.event as Record<string, any>;
    const currentAction: CurrentAction = 'Delete';
    this.scheduleObj.deleteEvent(eventDetails, currentAction);
    this.scheduleObj.closeQuickInfoPopup();
  }

  disablePopupOpen(args): void {
    args.cancel = true;
  }

  onCellClick(args: CellClickEventArgs): void {
    this.slotData = new SchedulerAvailabilityModel(new AvailabilityModel());
    this.slotData.startTime = args.startTime;
    this.slotData.endTime = args.endTime;
  }

  saveAvailabilities(): void {
    console.log(this.eventSettings.dataSource);
    const dialogRef = this.dialogUtil.openLoadingDialog('Saving changes...');
    this.availabilityService.addEditAndDeleteAvailabilities(this.eventSettings.dataSource as AvailabilityModel[]).subscribe(resp => {
      if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
        console.log('aaaaaaaaa');
      }
      dialogRef.close();
    });
  }

  onPopupClose(): void {
    this.slotData = new SchedulerAvailabilityModel(new AvailabilityModel());
  }

  // public onDateChange(args: ChangeEventArgs): void {
  //   if (!isNullOrUndefined(args.event)) {
  //     if (args.element.id === 'StartTime') {
  //       this.startDate = args.value;
  //     } else if (args.element.id === 'EndTime') {
  //       this.endDate = args.value;
  //     }
  //   }
  // }

  onEventRendered(args: EventRenderedArgs): void {
    args.element.style.backgroundColor = Constant.SCHEDULER_COLOR_1;
  }

  buttonClickActions(e: Event): void {
  }

  onActionBegin(args: ActionEventArgs): void {
    if (args.requestType === 'eventCreate' ||
      args.requestType === 'eventChange'
    ) {
      const eventData: any = args.data[0]
        ? args.data[0]
        : args.data;
      if (!this.scheduleObj.isSlotAvailable(eventData)) {
        args.cancel = true;
        this.store.dispatch(new ShowSnackBar('Overlapping availability slot is not allowed.'));
      }

    }
  }


}
