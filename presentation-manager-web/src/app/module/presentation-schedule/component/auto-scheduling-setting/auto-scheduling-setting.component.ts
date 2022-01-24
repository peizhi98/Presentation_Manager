import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constant} from '../../../../../assets/constant/app.constant';
import {Select, Store} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable} from 'rxjs';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {PresentationService} from '../../../../service/presentation.service';
import {
  AutoSchedulingModel,
  PresentationModeCheckModel,
  PresentationModel,
  PresentationScheduleModel, SchedulerPresentationModel
} from '../../../../model/presentation/presentation.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {PresentationMode} from '../../../../model/schedule/schedule.model';
import {RoomService} from '../../../../service/room.service';
import {ShowSnackBar} from '../../../../store/app/app.action';
import {MatStepper} from '@angular/material/stepper';
import {SchedulerComponent} from '../scheduler/scheduler.component';
import {RoomModel, RoomPresentationSlotsModel, SchedulerRoomPresentationSlotModel} from '../../../../model/room/RoomModel';
import {TimeRange} from '../../../../service/test.service';
import {
  ActionEventArgs,
  DragEventArgs,
  EventRenderedArgs, EventSettingsModel, GroupModel,
  ResizeEventArgs,
  ScheduleComponent,
  View
} from '@syncfusion/ej2-angular-schedule';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {RouteConstant} from '../../../../../assets/constant/route.contant';
import {ChangeEventArgs} from '@syncfusion/ej2-buttons';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-auto-scheduling-setting',
  templateUrl: './auto-scheduling-setting.component.html',
  styleUrls: ['./auto-scheduling-setting.component.css']
})
export class AutoSchedulingSettingComponent implements OnInit {
  @ViewChild('stepper')
  stepper: MatStepper;
  @ViewChild('slotScheduler')
  presentationSlotScheduler: SchedulerComponent;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  // select presentation step
  timeFormat = Constant.TIME_FORMAT;
  scheduleId: number;
  presentationModels: PresentationModeCheckModel[] = [];
  dataSource: MatTableDataSource<PresentationModeCheckModel>;
  displayedColumns = ['name', 'title', 'scheduledTime', 'check'];

  //slot scheduler
  presentationSlots: SchedulerRoomPresentationSlotModel[] = [];
  slotsGroupByRooms: RoomPresentationSlotsModel[] = [];
  rooms: RoomModel[] = [];

  //last step
  form: FormGroup;
  autoSchedulingModel: AutoSchedulingModel;

  autoScheduleRequest = null;

  @ViewChild(MatSort, {static: false}) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;




  @ViewChild('scheduleObj') scheduleObj: ScheduleComponent;
  selectedDate: Date;
  scheduleFirstLoad = true;
  rowAutoHeight = true;
  currentView: View = 'TimelineDay';
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
  presentationModelList: SchedulerPresentationModel[] = [];
  scheduledPresentations: SchedulerPresentationModel[] = [];

  constructor(private roomService: RoomService,
              private formBuilder: FormBuilder,
              private loadingUtil: LoadingDialogUtil,
              private presentationService: PresentationService,
              private store: Store,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.scheduleId$.subscribe(id => {
      this.scheduleId = id;
      const loadingRef = this.loadingUtil.openLoadingDialog();
      this.presentationService.getPresentations(id).subscribe(res => {
        if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
          this.presentationModels = (res.data as PresentationModeCheckModel[]);
          this.presentationModels.forEach(p => {
            p.online = false;
            p.online = false;
          });
          this.initTable();
          loadingRef.close();
        }
      });
    });
    this.form = this.fb.group(
      {duration: this.fb.control('', [Validators.required, Validators.min(1)])}
    );
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }

  initTable(): void {
    this.dataSource = new MatTableDataSource(this.presentationModels);
    this.initSortingAccessor();
    this.setFilterPredicate();
  }

  setFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };
  }

  // custom sorting accessor, MatTableDataSource use the column name to sort by default
  initSortingAccessor(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case this.displayedColumns[0]:
          return item.studentName;
        case this.displayedColumns[1]:
          return item.title;
        case this.displayedColumns[2]:
          return item.startTime;
        case this.displayedColumns[3]:
          return '';
        default:
          return item[property];
      }
    };
  }

  disableOtherModeIfThisChecked(row: any, checkedMode: PresentationMode): void {
    if (checkedMode === PresentationMode.ONLINE) {
      row.physical = false;
    } else {
      row.online = false;
    }
    console.log(row);
  }

  isOnline(row: any): boolean {
    return row.mode === PresentationMode.ONLINE;
  }

  isPhysical(row: any): boolean {
    console.log(row.mode === PresentationMode.PHYSICAL);
    return row.mode === PresentationMode.PHYSICAL;
  }

  get PresentationMode() {
    return PresentationMode;
  }

  generate(): void {
    // validate at least one presentation is checked
    const presentationChecked = this.presentationChecked();
    if (!presentationChecked) {
      this.stepper.selectedIndex = 0;
      this.store.dispatch(new ShowSnackBar('Please select at least one presentation to generate presentation schedule'));
      return;
    }
    // validate at least one presentation slot is added, then group the slot by room
    this.slotsGroupByRooms = [];
    this.presentationSlots = (this.presentationSlotScheduler.eventSettings.dataSource as SchedulerRoomPresentationSlotModel[]);
    if (this.presentationSlots && this.presentationSlots.length !== 0) {
      this.rooms = this.presentationSlotScheduler.resourceDataSource;
      this.rooms.forEach(r => {
        const slotsGroupByRoom: RoomPresentationSlotsModel = new RoomPresentationSlotsModel();
        this.slotsGroupByRooms.push(slotsGroupByRoom);
        slotsGroupByRoom.id = r.id;
        slotsGroupByRoom.name = r.name;
        slotsGroupByRoom.slots = [];
        this.presentationSlots.forEach(ps => {
          if (ps.roomId === r.id) {
            const tr = new TimeRange();
            tr.startTime = ps.startTime;
            tr.endTime = ps.endTime;
            slotsGroupByRoom.slots.push(tr);
          }
        });
      });
    } else {
      this.stepper.selectedIndex = 1;
      this.store.dispatch(new ShowSnackBar('Please input presentation slots to generate presentation schedule'));
      return;
    }
    if (this.slotsGroupByRooms.length > 0) {
      this.autoSchedulingModel = new AutoSchedulingModel();
      this.autoSchedulingModel.considerAvailability = true;
      this.autoSchedulingModel.roomPresentationSlotsModels = [];
      this.autoSchedulingModel.scheduleId = this.scheduleId;
      this.autoSchedulingModel.presentationDuration = this.form.get('duration').value;
      // separate online and physical room
      this.slotsGroupByRooms.forEach(room => {
        if (room.name === 'Online') {
          this.autoSchedulingModel.onlinePresentationSlotsModel = room;
        } else {
          this.autoSchedulingModel.roomPresentationSlotsModels.push(room);
        }
      });
      const onlinePresentations = [];
      const physicalPresentations = [];
      // separate online and physical presentation
      this.presentationModels.forEach(p => {
        if (p.online) {
          onlinePresentations.push(p);
        } else if (p.physical) {
          physicalPresentations.push(p);
        }
      });
      this.autoSchedulingModel.presentationsToScheduleOnline = onlinePresentations;
      this.autoSchedulingModel.presentationsToSchedulePhysical = physicalPresentations;
      console.log(this.autoSchedulingModel);
      this.autoScheduleRequest = this.presentationService.autoSchedulePresentations(this.autoSchedulingModel).subscribe(res => {
          if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
            console.log(res.data);
          } else {
            this.store.dispatch(new ShowSnackBar('Failed to auto generate valid presentation schedule. Please make sure panels are available on presentation slots.'));
          }
        }
      );
    }

  }

  presentationChecked(): boolean {
    if (this.presentationModels) {
      for (const p of this.presentationModels) {
        if (p.online || p.physical) {
          return true;
        }
      }
    }
    return false;
  }




  populatePresentation(): void {
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
              this.presentationModelList.push(schedulerPresentationModel);
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
              isBlock: 'true'
            },
            enableTooltip: true
          };
          this.eventSettings.dataSource = this.scheduledPresentations;
          loadingRef.close();
          this.scheduleFirstLoad = false;
        }
      });
    });
  }

  onChange(args: ChangeEventArgs): void {
    this.scheduleObj.rowAutoHeight = args.checked;
  }
  onEventRendered(args: EventRenderedArgs): void {
    const scheduledSaved: boolean = args.data.scheduleSaved as boolean;
    if (!args.element) {
      return;
    }
    if (scheduledSaved) {
      args.element.style.backgroundColor = Constant.SCHEDULER_COLOR_1;
    } else {
      args.element.style.backgroundColor = Constant.SCHEDULER_COLOR_2;
    }
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
        this.presentationModelList = [];
        this.scheduledPresentations = [];
        console.log(this.scheduleObj);
        console.log(this.scheduleObj.getCurrentViewDates());
        // this.selectedDate = this.scheduleObj.getCurrentViewDates()[0];
        this.ngOnInit();
      }
      loadingDialog.close();
    });
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

  }

}
