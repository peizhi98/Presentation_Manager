import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
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
import {Observable} from 'rxjs';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {PresentationModel, PresentationScheduleModel, SchedulerPresentationModel} from '../../../../model/presentation/presentation.model';
import {RoomService} from '../../../../service/room.service';
import {RoomModel} from '../../../../model/room/RoomModel';
import {ActivatedRoute, Router} from '@angular/router';
import {RouteConstant} from '../../../../../assets/constant/route.contant';
import {DatePipe} from '@angular/common';
import {ShowSnackBar} from '../../../../store/app/app.action';

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
export class TimetableComponent implements OnInit {

  @ViewChild('scheduleObj') scheduleObj: ScheduleComponent;
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

  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;

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

  onChange(args: ChangeEventArgs): void {
    this.scheduleObj.rowAutoHeight = args.checked;
  }

  ngOnInit(): void {
    this.roomService.getAllRooms().subscribe(res => {
      if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
        this.resourceDataSource = res.data;
      }
    });
    const loadingRef = this.loadingUtil.openLoadingDialog();
    this.scheduleId$.subscribe(id => {
      let selectedTime: Date = new Date();
      let counter = 0;
      this.presentationService.getPresentationsWithAvailability(id).subscribe(res => {
        if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
          console.log(res.data);
          (res.data as SchedulerPresentationModel[]).forEach((presentationData, index) => {
            const schedulerPresentationModel: SchedulerPresentationModel = new SchedulerPresentationModel();
            schedulerPresentationModel.id = presentationData.id;
            schedulerPresentationModel.roomId = presentationData.roomId;
            schedulerPresentationModel.roomName = presentationData.roomName;
            schedulerPresentationModel.title = presentationData.title;
            schedulerPresentationModel.studentName = presentationData.studentName;
            schedulerPresentationModel.panelModels = presentationData.panelModels;
            schedulerPresentationModel.supervisorModel = presentationData.supervisorModel;
            // schedulerPresentationModel.IsBlock = true;
            if (presentationData.startTime && presentationData.endTime) {
              schedulerPresentationModel.startTime = new Date(presentationData.startTime);
              schedulerPresentationModel.endTime = new Date(presentationData.endTime);
            }
            schedulerPresentationModel.commonAvailabilityList = presentationData.commonAvailabilityList;
            schedulerPresentationModel.IsBlock = true;
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
              this.selectedDate = selectedTime;
            }
          });
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
    });
  }

  @HostListener('window:mouseup', ['$event'])
  handlePresentationDropped(event): void {
    if (this.draggingPresentation && event.target.classList.contains('e-work-cells')) {
      this.dragging = false;
      const cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(event.target);
      if (cellData) {
        const resourceDetails: ResourceDetails = this.scheduleObj.getResourcesByIndex(cellData.groupIndex);
        // const eventData: Record<string, any> = {
        //   // Name: filteredData[0].Name,
        //   title: this.draggingPresentation.title,
        //   startTime: cellData.startTime,
        //   endTime: cellData.endTime,
        //   // IsAllDay: cellData.isAllDay,
        //   // Description: filteredData[0].Description,
        //   // DepartmentID: resourceDetails.resourceData.GroupId,
        //   // RoomId: resourceDetails.resourceData.id
        // };
        this.draggingPresentation.startTime = cellData.startTime;
        this.draggingPresentation.endTime = cellData.endTime;
        this.draggingPresentation.roomId = resourceDetails.resourceData.id;
        this.draggingPresentation.roomName = resourceDetails.resourceData.name;
        this.addToTimetable(this.draggingPresentation);
        // this.addToTimetable(eventData);
        this.presentationModels.splice(this.draggingIndex, 1);
        this.draggingPresentation = null;
        this.draggingIndex = null;
        // transferArrayItem(
        //   this.presentationModels,
        //   this.scheduledPresentations,
        //   this.draggingIndex,
        //   this.scheduledPresentations.length,
        // );
        // this.scheduleObj.openEditor(eventData, 'Add', true);
      }
    } else {
      this.draggingPresentation = null;
      this.draggingIndex = null;
    }
  }

  onEventRendered(args: EventRenderedArgs): void {
    const scheduledSaved: boolean = args.data.scheduleSaved as boolean;

    if (args.data && args.data.commonAvailabilityList) {
      for (const ca of args.data.commonAvailabilityList) {
        console.log(new Date(args.data.startTime));
        console.log(new Date(args.data.endTime));

        console.log(new Date(ca.startTime));
        console.log(new Date(ca.endTime));
        console.log((new Date(ca.startTime).valueOf() <= new Date(args.data.endTime).valueOf()));
        if ((new Date(ca.startTime).valueOf() <= new Date(args.data.startTime).valueOf())
          && (new Date(ca.endTime).valueOf() >= new Date(args.data.endTime).valueOf())) {
          args.element.style.backgroundColor = Constant.SCHEDULER_COLOR_1;
          return;
        }
      }
      args.element.style.backgroundColor = 'red';
    }
    // if (!args.element) {
    //   return;
    // }
    // if (scheduledSaved) {
    //   args.element.style.backgroundColor = Constant.SCHEDULER_COLOR_1;
    // } else {
    //   args.element.style.backgroundColor = Constant.SCHEDULER_COLOR_2;
    // }
  }

  onSchedulerDragStart(args: DragEventArgs): void {
    args.interval = 5;
    args.navigation.enable = true;
  }

  onSchedulerDragStop(args: DragEventArgs): void {
    args.data.scheduleSaved = false;
  }

  onResizeStart(args: ResizeEventArgs): void {
    args.interval = 5;
    args.data.scheduleSaved = false;
    console.log(args.data);
  }

  onResizeStop(args: ResizeEventArgs): void {
    args.data.scheduleSaved = false;
    args.element.style.backgroundColor = 'rgb(75, 192, 192)';
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
      if (sp.startTime && sp.endTime) {
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
    const now: Date = new Date();
    if (((args.data && args.data[0] && new Date(args.data[0].startTime).valueOf() <= now.valueOf())
      || (args.changedRecords && args.changedRecords[0] && new Date(args.changedRecords[0].startTime).valueOf() <= now.valueOf()))
      && (args.requestType === 'eventCreate' ||
        args.requestType === 'eventChange')
    ) {
      args.cancel = true;
      this.store.dispatch(new ShowSnackBar('Add or edit presentation in history is not allowed.'));
      return;
    }
    //disable overlapping physical presentation
    if (!(args.data && args.data[0] && args.data[0].roomName === 'Online') &&
      !(args.changedRecords && args.changedRecords[0] && args.changedRecords[0].roomName === 'Online') &&
      (args.requestType === 'eventCreate' ||
        args.requestType === 'eventChange')
    ) {
      const eventData: any = args.data[0]
        ? args.data[0]
        : args.data;

      if (!this.scheduleObj.isSlotAvailable(eventData)) {
        args.cancel = true;
        this.store.dispatch(new ShowSnackBar('Overlapping physical presentation is not allowed.'));
      }
    }
  }

  onActionComplete(args: ActionEventArgs): void {
    console.log(args);
    // if (!(args.data && args.data[0] && args.data[0].roomName === 'Online') &&
    //   !(args.changedRecords && args.changedRecords[0] && args.changedRecords[0].roomName === 'Online') &&
    //   (args.requestType === 'eventCreate' ||
    //     args.requestType === 'eventChange')
    // ) {
    //   const eventData: any = args.data[0]
    //     ? args.data[0]
    //     : args.data;
    //
    //   if (!this.scheduleObj.isSlotAvailable(eventData)) {
    //     args.cancel = true;
    //     this.store.dispatch(new ShowSnackBar('Overlapping physical presentation is not allowed.'));
    //   }
    // }
  }


}
