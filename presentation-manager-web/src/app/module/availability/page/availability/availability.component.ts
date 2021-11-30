import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ActionEventArgs,
  CellClickEventArgs,
  CurrentAction,
  DayService,
  DragAndDropService,
  DragEventArgs,
  EventClickArgs,
  EventRenderedArgs,
  EventSettingsModel,
  MonthAgendaService,
  MonthService,
  ResizeEventArgs,
  ResizeService,
  ScheduleComponent,
  View,
  WeekService,
  WorkWeekService,
  YearService
} from '@syncfusion/ej2-angular-schedule';
import {isNullOrUndefined} from '@syncfusion/ej2-base';
import {SchedulerAvailabilityModel, AvailabilityModel} from '../../../../model/availability.model';
import {AvailabilityService} from '../../../../service/availability.service';
import {Constant} from '../../../../../assets/constant/app.constant';
import {Store} from '@ngxs/store';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css'],
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    YearService,
    MonthAgendaService,
    DragAndDropService,
    ResizeService
  ]
})
export class AvailabilityComponent implements OnInit {
  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
  public startHour = '08:00';
  public endHour = '18:00';
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


  public onEventRendered(args: EventRenderedArgs): void {
    // switch (args.data.EventType) {
    //   case 'Requested':
    //     (args.element as HTMLElement).style.backgroundColor = '#F57F17';
    //     break;
    //   case 'Confirmed':
    //     (args.element as HTMLElement).style.backgroundColor = '#7fa900';
    //     break;
    //   case 'New':
    //     (args.element as HTMLElement).style.backgroundColor = '#8e24aa';
    //     break;
    // }
  }

  onActionBegin(args: ActionEventArgs): void {
    //   if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
    //     const data: Record<string, any> = args.data instanceof Array ? args.data[0] : args.data;
    //     if (!this.scheduleObj.isSlotAvailable(data.StartTime as Date, data.EndTime as Date)) {
    //       args.cancel = true;
    //     }
    //   }
  }

  buttonClickActions(e: Event): void {
    // const quickPopup: HTMLElement = closest(e.target as HTMLElement, '.e-quick-popup-wrapper') as HTMLElement;
    // const getSlotData: CallbackFunction = (): Record<string, any> => {
    //   let cellDetails: CellClickEventArgs = this.scheduleObj.getCellDetails(this.scheduleObj.getSelectedElements());
    //   if (isNullOrUndefined(cellDetails)) {
    //     cellDetails = this.scheduleObj.getCellDetails(this.scheduleObj.activeCellsData.element);
    //   }
    //   const subject = ((quickPopup.querySelector('#title') as EJ2Instance).ej2_instances[0] as TextBoxComponent).value;
    //   const notes = ((quickPopup.querySelector('#notes') as EJ2Instance).ej2_instances[0] as TextBoxComponent).value;
    //   const addObj: Record<string, any> = {};
    //   addObj.Id = this.scheduleObj.getEventMaxID();
    //   addObj.Subject = isNullOrUndefined(subject) ? 'Available' : subject;
    //   addObj.StartTime = new Date(+cellDetails.startTime);
    //   addObj.EndTime = new Date(+cellDetails.endTime);
    //   addObj.IsAllDay = cellDetails.isAllDay;
    //   addObj.Description = isNullOrUndefined(notes) ? 'Add notes' : notes;
    //   addObj.RoomId = ((quickPopup.querySelector('#eventType') as EJ2Instance).ej2_instances[0] as DropDownListComponent).value;
    //   return addObj;
    // };
    // if ((e.target as HTMLElement).id === 'add') {
    //   const addObj: Record<string, any> = getSlotData();
    //   this.scheduleObj.addEvent(addObj);
    // } else if ((e.target as HTMLElement).id === 'delete') {
    //   const eventDetails: Record<string, any> = this.scheduleObj.activeEventData.event as Record<string, any>;
    //   let currentAction: CurrentAction;
    //   if (eventDetails.RecurrenceRule) {
    //     currentAction = 'DeleteOccurrence';
    //   }
    //   this.scheduleObj.deleteEvent(eventDetails, currentAction);
    // } else {
    //   const isCellPopup: boolean = quickPopup.firstElementChild.classList.contains('e-cell-popup');
    //   const eventDetails: Record<string, any> = isCellPopup ? getSlotData() :
    //     this.scheduleObj.activeEventData.event as Record<string, any>;
    //   let currentAction: CurrentAction = isCellPopup ? 'Add' : 'Save';
    //   if (eventDetails.RecurrenceRule) {
    //     currentAction = 'EditOccurrence';
    //   }
    //   this.scheduleObj.openEditor(eventDetails, currentAction, true);
    // }
    // this.scheduleObj.closeQuickInfoPopup();
  }


}
