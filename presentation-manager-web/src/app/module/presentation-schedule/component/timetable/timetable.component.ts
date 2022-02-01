import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChangeEventArgs} from '@syncfusion/ej2-buttons';
import {
  ActionEventArgs,
  CellClickEventArgs,
  DragAndDropService,
  DragEventArgs,
  EventRenderedArgs,
  EventSettingsModel,
  GroupModel,
  ResizeEventArgs,
  ResizeService,
  ResourceDetails,
  ScheduleComponent,
  TimelineViewsService,
  View
} from '@syncfusion/ej2-angular-schedule';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {PresentationService} from '../../../../service/presentation.service';
import {Constant} from '../../../../../assets/constant/app.constant';
import {Select, Store} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable, Subscription} from 'rxjs';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {
  PresentationModel,
  PresentationScheduleModel,
  SchedulerModel,
  SchedulerPresentationModel
} from '../../../../model/presentation/presentation.model';
import {RoomService} from '../../../../service/room.service';
import {RoomModel} from '../../../../model/room/RoomModel';
import {ActivatedRoute, Router} from '@angular/router';
import {RouteConstant} from '../../../../../assets/constant/route.contant';
import {DatePipe} from '@angular/common';
import {ShowSnackBar} from '../../../../store/app/app.action';
import {ScheduleType} from '../../../../model/schedule/schedule.model';
import {SystemRole} from '../../../../model/user/user.model';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css'],
  providers: [
    TimelineViewsService,
    DragAndDropService,
    ResizeService
  ]
})
export class TimetableComponent implements OnInit, OnDestroy {

  @ViewChild('scheduleObj') scheduleObj: ScheduleComponent;
  scheduleType: ScheduleType;
  startHour = Constant.SCHEDULER_START_HOUR;
  endHour = Constant.SCHEDULER_END_HOUR;
  selectedDate: Date;
  scheduleFirstLoad = true;
  rowAutoHeight = true;
  currentView: View = 'TimelineDay';
  timeFormat = Constant.TIME_FORMAT;
  dateFormat = Constant.DATE_FORMAT;
  datePipe = new DatePipe('en-US');
  group: GroupModel = {
    enableCompactView: false,
    resources: ['MeetingRoom']
  };
  dragging = false;
  allowMultiple = true;
  draggingIndex: number = null;
  draggingPresentation: SchedulerPresentationModel = null;
  disableDrag = false;

  resourceDataSource: RoomModel[];
  eventSettings: EventSettingsModel;
  presentationModels: SchedulerPresentationModel[] = [];
  scheduledPresentations: SchedulerPresentationModel[] = [];
  scheduler: SchedulerModel;

  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;
  @Select(ScheduleState.getScheduleType)
  scheduleType$: Observable<ScheduleType>;

  subs: Subscription[] = [];

  constructor(
    private presentationService: PresentationService,
    private loadingUtil: LoadingDialogUtil,
    private roomService: RoomService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    // sourceFiles.files = ['adaptive-rows.style.css'];
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => {
      s.unsubscribe();
    });
  }

  onChange(args: ChangeEventArgs): void {
    this.scheduleObj.rowAutoHeight = args.checked;
  }

  ngOnInit(): void {
    console.log('timetable');
    this.subs.push(this.scheduleType$.subscribe(type => {
      this.scheduleType = type;
    }));
    this.subs.push(this.roomService.getAllRooms().subscribe(res => {
      if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
        this.resourceDataSource = res.data;
        console.log(this.resourceDataSource);
      }
    }));
    const loadingRef = this.loadingUtil.openLoadingDialog();
    this.subs.push(this.scheduleId$.subscribe(id => {
      let selectedTime: Date = new Date();
      let counter = 0;
      this.presentationService.getScheduler(id).subscribe(res => {
        if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
          console.log(res.data);
          this.scheduler = res.data;
          if (this.scheduler != null) {
            this.scheduler.presentationToSchedule.forEach((presentationData, index) => {
              const schedulerPresentationModel: SchedulerPresentationModel = new SchedulerPresentationModel();
              schedulerPresentationModel.id = presentationData.id;
              schedulerPresentationModel.roomId = presentationData.roomId;
              schedulerPresentationModel.roomName = presentationData.roomName;
              schedulerPresentationModel.title = presentationData.title;
              schedulerPresentationModel.studentName = presentationData.studentName;
              schedulerPresentationModel.panelModels = presentationData.panelModels;
              schedulerPresentationModel.chairperson = presentationData.chairperson;
              schedulerPresentationModel.supervisorModel = presentationData.supervisorModel;
              if (presentationData.startTime && presentationData.endTime) {
                schedulerPresentationModel.startTime = new Date(presentationData.startTime);
                schedulerPresentationModel.endTime = new Date(presentationData.endTime);
              }
              schedulerPresentationModel.commonAvailabilityList = presentationData.commonAvailabilityList;
              schedulerPresentationModel.scheduleModel = presentationData.scheduleModel;
              if (presentationData.startTime && presentationData.endTime) {
                this.scheduledPresentations.push(schedulerPresentationModel);
                schedulerPresentationModel.scheduleSaved = true;
              } else {
                this.presentationModels.push(schedulerPresentationModel);
                schedulerPresentationModel.scheduleSaved = false;
              }

              if (this.scheduleFirstLoad && schedulerPresentationModel.startTime) {
                if (counter === 0) {
                  selectedTime = schedulerPresentationModel.startTime;
                  counter++;
                  console.log(selectedTime);
                } else if (selectedTime.valueOf() > schedulerPresentationModel.startTime.valueOf()) {
                  selectedTime = schedulerPresentationModel.startTime;
                  console.log(selectedTime);
                }

              }
            });
          }
          this.selectedDate = selectedTime;
          if (this.scheduler.unAvailableTime) {
            this.scheduler.unAvailableTime.forEach((presentationData, index) => {
              if (presentationData.roomName !== 'Online') {
                const schedulerPresentationModel: SchedulerPresentationModel = new SchedulerPresentationModel();
                schedulerPresentationModel.roomId = presentationData.roomId;
                schedulerPresentationModel.roomName = presentationData.roomName;
                schedulerPresentationModel.title = 'Unavailable';
                schedulerPresentationModel.isBlock = true;
                schedulerPresentationModel.scheduleModel = presentationData.scheduleModel;
                if (presentationData.startTime && presentationData.endTime) {
                  // as block event
                  this.scheduledPresentations.push(schedulerPresentationModel);
                  schedulerPresentationModel.startTime = new Date(presentationData.startTime);
                  schedulerPresentationModel.endTime = new Date(presentationData.endTime);
                }
              }

            });
          }

          this.eventSettings = {
            fields: {
              id: 'schedulerId',
              subject: {name: 'title', title: 'Title'},
              // location: {name: 'Location', title: 'Location'},
              // description: {name: 'Description', title: 'Comments'},
              startTime: {name: 'startTime', title: 'From'},
              endTime: {name: 'endTime', title: 'To'},
              isBlock: 'true',
            },
            enableTooltip: true
          };
          // const schedulerPresentationModels: SchedulerPresentationModel[] = [];
          // this.eventSettings.dataSource = schedulerPresentationModels;
          this.eventSettings.dataSource = this.scheduledPresentations;
          loadingRef.close();
          this.scheduleFirstLoad = false;
        }
      });
    }));
  }

  @HostListener('window:mouseup', ['$event'])
  handlePresentationDropped(event): void {
    if (this.draggingPresentation && event.target.classList.contains('e-work-cells')) {
      const now = new Date();
      this.dragging = false;
      const cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(event.target);
      console.log(cellData);
      if (cellData) {
        const resourceDetails: ResourceDetails = this.scheduleObj.getResourcesByIndex(cellData.groupIndex);
        if (new Date(cellData.startTime).valueOf() <= now.valueOf()
        ) {
          this.store.dispatch(new ShowSnackBar('Add or edit presentation in history is not allowed.'));
          return;
        }
        // disable overlapping physical presentation
        if (!(resourceDetails.resourceData.name === 'Online')
        ) {
          if (!this.scheduleObj.isSlotAvailable(cellData.startTime, cellData.endTime, cellData.groupIndex)) {
            this.store.dispatch(new ShowSnackBar('Overlapping physical presentation is not allowed.'));
            return;
          }
        }
        console.log(123);
        this.draggingPresentation.startTime = cellData.startTime;
        this.draggingPresentation.endTime = cellData.endTime;
        this.draggingPresentation.roomId = resourceDetails.resourceData.id;
        this.draggingPresentation.roomName = resourceDetails.resourceData.name;
        this.addToTimetable(this.draggingPresentation);
        this.presentationModels.splice(this.draggingIndex, 1);
        this.draggingPresentation = null;
        this.draggingIndex = null;
      }
    } else {
      this.draggingPresentation = null;
      this.draggingIndex = null;
    }
  }

  onEventRendered(args: EventRenderedArgs): void {
    if (args.data.isBlock) {
      args.element.style.backgroundColor = Constant.SCHEDULER_COLOR_BLOCKED;
      return;
    }
    if (args.data && args.data.commonAvailabilityList) {
      for (const ca of args.data.commonAvailabilityList) {
        if ((new Date(ca.startTime).valueOf() <= new Date(args.data.startTime).valueOf())
          && (new Date(ca.endTime).valueOf() >= new Date(args.data.endTime).valueOf())) {
          args.element.style.backgroundColor = Constant.SCHEDULER_COLOR_1;
          return;
        }
      }
      args.element.style.backgroundColor = '#f64747';
    }
  }

  onSchedulerDragStart(args: DragEventArgs): void {
    args.interval = 5;
    args.navigation.enable = true;
    console.log(args);
    let eventData: any = null;
    if (args != null && args.data && args.data[0]) {
      eventData = args.data[0];
    } else if (args != null && args.data) {
      eventData = args.data;
    }
    if (eventData && eventData.isBlock) {
      args.cancel = true;
      return;
    }
  }


  onSchedulerDragStop(args: DragEventArgs): void {
    args.data.scheduleSaved = false;
  }

  onResizeStart(args: ResizeEventArgs): void {
    args.interval = 5;
    console.log(args);
    let eventData: any = null;
    if (args != null && args.data && args.data[0]) {
      eventData = args.data[0];
    } else if (args != null && args.data) {
      eventData = args.data;
    }
    if (eventData && eventData.isBlock) {
      args.cancel = true;
      return;
    }
  }

  onResizeStop(args: ResizeEventArgs): void {
  }

  onCdkDragStart(presentation, index): void {
    // this.dragging = true;
    this.draggingIndex = index;
    this.draggingPresentation = presentation;
  }

  testDrop(event: MouseEvent): void {

  }

  drop(event: CdkDragDrop<PresentationModel[]>): void {

  }

  addToTimetable(data): void {
    data.schedulerId = this.scheduleObj.getEventMaxID();
    this.scheduleObj.addEvent(data);
  }

  disablePopupOpen(args): void {
    args.cancel = true;
  }

  save(): void {
    const loadingDialog = this.loadingUtil.openLoadingDialog();
    const presentationSchedules: PresentationScheduleModel[] = [];
    this.scheduledPresentations.forEach(sp => {
      if (sp.startTime && sp.endTime && !sp.isBlock) {
        const presentationScheduleModel: PresentationScheduleModel = new PresentationScheduleModel();
        presentationScheduleModel.endTime = sp.endTime;
        presentationScheduleModel.startTime = sp.startTime;
        presentationScheduleModel.id = sp.id;
        presentationScheduleModel.roomId = sp.roomId;
        presentationSchedules.push(presentationScheduleModel);
      }
    });
    this.presentationService.schedulePresentations(presentationSchedules).subscribe((resp) => {
      if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
        this.presentationModels = [];
        this.scheduledPresentations = [];
        console.log(this.scheduleObj);
        console.log(this.scheduleObj.getCurrentViewDates());
        // this.selectedDate = this.scheduleObj.getCurrentViewDates()[0];
        this.ngOnInit();
      }
      loadingDialog.close();
    });
  }

  navigateToAutoSchedule(): void {
    this.router.navigate([RouteConstant.AUTO_SCHEDULE], {relativeTo: this.activatedRoute});
  }

  onActionBegin(args: ActionEventArgs): void {
    console.log(args);
    const now: Date = new Date();
    let eventData: any = null;
    if (args != null && args.data && args.data[0]) {
      eventData = args.data[0];
    } else if (args != null && args.data) {
      eventData = args.data;
    }
    if (((eventData && eventData && new Date(eventData.startTime).valueOf() <= now.valueOf())
      || (args.changedRecords && args.changedRecords[0] && new Date(args.changedRecords[0].startTime).valueOf() <= now.valueOf()))
      && (args.requestType === 'eventCreate' ||
        args.requestType === 'eventChange')
    ) {
      args.cancel = true;
      this.store.dispatch(new ShowSnackBar('Add or edit presentation in history is not allowed.'));
      return;
    }
    // disable overlapping physical presentation
    if (!(eventData && eventData && this.getRoomName(eventData.roomId) === 'Online') &&
      !(args.changedRecords && args.changedRecords[0] && this.getRoomName(args.changedRecords[0].roomId) === 'Online') &&
      (args.requestType === 'eventCreate' ||
        args.requestType === 'eventChange')
    ) {
      if (!this.scheduleObj.isSlotAvailable(eventData)) {
        args.cancel = true;
        this.store.dispatch(new ShowSnackBar('Overlapping physical presentation is not allowed.'));
      }
    }
  }

  onActionComplete(args: ActionEventArgs): void {
  }

  isMaster(): boolean {
    return this.scheduleType === ScheduleType.MASTER_DISSERTATION;
  }

  getRoomName(id: number): string {
    for (const r of this.resourceDataSource) {
      if (r.id === id) {
        return r.name;
      }
    }
    return '';
  }
  get SystemRole() {
    return SystemRole;
  }
}
