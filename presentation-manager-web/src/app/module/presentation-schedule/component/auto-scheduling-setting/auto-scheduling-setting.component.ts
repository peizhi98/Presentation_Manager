import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constant} from '../../../../../assets/constant/app.constant';
import {Select, Store} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable, Subscription} from 'rxjs';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {PresentationService} from '../../../../service/presentation.service';
import {
  AutoSchedulingModel,
  PresentationModeCheckModel,
  PresentationScheduleModel,
  SchedulerModel,
  SchedulerPresentationModel
} from '../../../../model/presentation/presentation.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {PresentationMode, ScheduleType} from '../../../../model/schedule/schedule.model';
import {RoomService} from '../../../../service/room.service';
import {ShowSnackBar} from '../../../../store/app/app.action';
import {MatStepper} from '@angular/material/stepper';
import {SchedulerComponent} from '../scheduler/scheduler.component';
import {RoomModel, RoomPresentationSlotsModel, SchedulerRoomPresentationSlotModel} from '../../../../model/room/RoomModel';
import {TimeRange} from '../../../../service/test.service';
import {
  ActionEventArgs,
  DragEventArgs,
  EventRenderedArgs,
  EventSettingsModel,
  GroupModel,
  ResizeEventArgs,
  ScheduleComponent,
  View
} from '@syncfusion/ej2-angular-schedule';
import {ChangeEventArgs} from '@syncfusion/ej2-buttons';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {SystemRole} from '../../../../model/user/user.model';

@Component({
  selector: 'app-auto-scheduling-setting',
  templateUrl: './auto-scheduling-setting.component.html',
  styleUrls: ['./auto-scheduling-setting.component.css']
})
export class AutoSchedulingSettingComponent implements OnInit, OnDestroy {
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
  scheduleType: ScheduleType;
  presentationModels: PresentationModeCheckModel[] = [];
  dataSource: MatTableDataSource<PresentationModeCheckModel>;
  displayedColumns = ['name', 'title', 'scheduledTime', 'check'];

  // slot scheduler
  presentationSlots: SchedulerRoomPresentationSlotModel[] = [];
  slotsGroupByRooms: RoomPresentationSlotsModel[] = [];
  rooms: RoomModel[] = [];

  // last step
  form: FormGroup;
  autoSchedulingModel: AutoSchedulingModel;
  scheduleGenerated = false;
  durationList = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

  autoScheduleRequest = null;

  @ViewChild(MatSort, {static: false}) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;
  @Select(ScheduleState.getScheduleType)
  scheduleType$: Observable<ScheduleType>;

  subs: Subscription[] = [];

  @ViewChild('scheduleObj') scheduleObj: ScheduleComponent;
  startHour = Constant.SCHEDULER_START_HOUR;
  endHour = Constant.SCHEDULER_END_HOUR;
  selectedDate: Date;
  scheduleFirstLoad = true;
  rowAutoHeight = true;
  currentView: View = 'TimelineDay';
  dateFormat = Constant.DATE_FORMAT;
  datePipe = new DatePipe('en-US');
  group: GroupModel = {
    enableCompactView: true,
    resources: ['MeetingRoom']
  };
  allowMultiple = true;

  resourceDataSource: RoomModel[];
  eventSettings: EventSettingsModel;
  autoSchedulingResultScheduler: SchedulerModel;
  autoScheduledPresentations: SchedulerPresentationModel[] = [];

  constructor(private roomService: RoomService,
              private formBuilder: FormBuilder,
              private loadingUtil: LoadingDialogUtil,
              private presentationService: PresentationService,
              private store: Store,
              private fb: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    // for (let i = 15; i <= 60; i + 5) {
    //   this.durationList.push(i);
    // }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => {
      s.unsubscribe();
    });
  }

  ngOnInit() {
    this.subs.push(this.scheduleId$.subscribe(id => {
      this.scheduleId = id;
      const loadingRef = this.loadingUtil.openLoadingDialog();
      console.log('auto-scheduling');
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
    }));
    this.subs.push(this.scheduleType$.subscribe(type => {
      this.scheduleType = type;
    }));
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
        slotsGroupByRoom.name = this.getRoomName(r.id);
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
    this.form.markAllAsTouched();
    if (this.slotsGroupByRooms.length > 0 && this.form.valid) {
      const loadingRef = this.loadingUtil.openLoadingDialog('Scheduling Presentations. Please wait...');
      this.autoSchedulingModel = new AutoSchedulingModel();
      this.autoSchedulingModel.considerAvailability = true;
      this.autoSchedulingModel.roomPresentationSlotsModels = [];
      this.autoSchedulingModel.scheduleId = this.scheduleId;
      this.autoSchedulingModel.presentationDuration = this.form.get('duration').value;
      // separate online and physical room
      this.slotsGroupByRooms.forEach(room => {
        if (this.getRoomName(room.id) === 'Online') {
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
      this.autoScheduleRequest = this.presentationService.autoSchedulePresentations(this.autoSchedulingModel).subscribe(res => {
          if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
            console.log(res.data);
            this.populatePresentation(res.data);
            this.scheduleGenerated = true;

          } else {
            this.store.dispatch(new ShowSnackBar('Failed to auto generate valid presentation schedule. ' + res.message));
          }
          loadingRef.close();
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


  populatePresentation(schedulerModel: SchedulerModel): void {
    this.autoScheduledPresentations = [];
    this.autoSchedulingResultScheduler = schedulerModel;
    this.resourceDataSource = this.presentationSlotScheduler.resourceDataSource;
    let counter = 0;
    let selectedTime = new Date();
    this.autoSchedulingResultScheduler.presentationToSchedule.forEach((presentationData, index) => {
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
      this.autoScheduledPresentations.push(schedulerPresentationModel);

      if (this.scheduleFirstLoad && schedulerPresentationModel.startTime) {
        if (counter === 0) {
          selectedTime = schedulerPresentationModel.startTime;
          counter++;
        } else if (selectedTime.valueOf() > schedulerPresentationModel.startTime.valueOf()) {
          selectedTime = schedulerPresentationModel.startTime;
        }
      }
    });
    this.selectedDate = selectedTime;
    // populate blocked time range
    if (this.autoSchedulingResultScheduler.unAvailableTime) {
      this.autoSchedulingResultScheduler.unAvailableTime.forEach((presentationData, index) => {
        if (presentationData.roomName !== 'Online') {
          const schedulerPresentationModel: SchedulerPresentationModel = new SchedulerPresentationModel();
          schedulerPresentationModel.roomId = presentationData.roomId;
          schedulerPresentationModel.roomName = presentationData.roomName;
          schedulerPresentationModel.title = 'Unavailable';
          schedulerPresentationModel.isBlock = true;
          schedulerPresentationModel.scheduleModel = presentationData.scheduleModel;
          if (presentationData.startTime && presentationData.endTime) {
            // as block event
            this.autoScheduledPresentations.push(schedulerPresentationModel);
            schedulerPresentationModel.startTime = new Date(presentationData.startTime);
            schedulerPresentationModel.endTime = new Date(presentationData.endTime);
          }
        }
      });
    }
    this.eventSettings = {
      fields: {
        id: 'schedulerId',
        subject: {name: 'studentName', title: 'Student'},
        startTime: {name: 'startTime', title: 'From'},
        endTime: {name: 'endTime', title: 'To'},
        isBlock: 'true',
      },
      enableTooltip: true
    };
    this.eventSettings.dataSource = [];
    this.eventSettings.dataSource = this.autoScheduledPresentations;
    this.scheduleFirstLoad = false;

  }

  onChange(args: ChangeEventArgs): void {
    this.scheduleObj.rowAutoHeight = args.checked;
  }

  onEventRendered(args: EventRenderedArgs): void {
    if (args.data.isBlock) {
      args.element.style.backgroundColor = Constant.SCHEDULER_COLOR_BLOCKED;
      return;
    }
    // // check same panel
    // for (const p of this.autoScheduledPresentations) {
    //   if (p.panelModels && args.data.panelModels && args.data.id !== p.id) {
    //     for (const panel of p.panelModels) {
    //       for (const thisPresentationPanel of args.data.panelModels) {
    //         if (thisPresentationPanel.id === panel.id) {
    //           if ((new Date(p.startTime).valueOf() < new Date(args.data.endTime).valueOf())
    //             && new Date(args.data.startTime).valueOf() < (new Date(p.endTime).valueOf())) {
    //             args.element.style.backgroundColor = 'black';
    //             return;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    const eventData = args.data;
    // check same panel
    for (const p of this.autoScheduledPresentations) {
      if (p.panelModels && eventData.panelModels && eventData.id !== p.id) {
        let pHasChairperson = false;
        let draggingHasChairperson = false;
        if (p.chairperson) {
          p.panelModels.push(p.chairperson);
          pHasChairperson = true;
        }
        if (eventData.chairperson) {
          eventData.panelModels.push(eventData.chairperson);
          draggingHasChairperson = true;
        }
        for (const panel of p.panelModels) {
          for (const thisPresentationPanel of eventData.panelModels) {
            if (thisPresentationPanel.id === panel.id) {
              if ((new Date(p.startTime).valueOf() < new Date(eventData.endTime).valueOf())
                && new Date(eventData.startTime).valueOf() < (new Date(p.endTime).valueOf())) {
                if (pHasChairperson) {
                  p.panelModels.pop();
                }
                if (draggingHasChairperson) {
                  eventData.panelModels.pop();
                }
                args.element.style.backgroundColor = 'black';
                return;
              }
            }
          }
        }
        if (pHasChairperson) {
          p.panelModels.pop();
        }
        if (draggingHasChairperson) {
          eventData.panelModels.pop();
        }
      }
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
    this.autoScheduledPresentations.forEach(sp => {
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
        this.store.dispatch(new ShowSnackBar('Successfully save generated presentations time.'));
        this.router.navigate(['../'], {relativeTo: this.activatedRoute});
      }
      loadingDialog.close();
    });
  }

  onActionBegin(args: ActionEventArgs): void {
    const now: Date = new Date();
    const eventData: any = args.data[0]
      ? args.data[0]
      : args.data;
    if (((eventData && eventData && new Date(eventData.startTime).valueOf() <= now.valueOf())
      || (args.changedRecords && args.changedRecords[0] && new Date(args.changedRecords[0].startTime).valueOf() <= now.valueOf()))
      && (args.requestType === 'eventCreate' ||
        args.requestType === 'eventChange')
    ) {
      args.cancel = true;
      this.store.dispatch(new ShowSnackBar('Add presentation slot in history is not allowes'));
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

    // check same panel
    if ((args.requestType === 'eventCreate' || args.requestType === 'eventChange') && eventData) {
      for (const p of this.autoScheduledPresentations) {
        if (p.panelModels && eventData.panelModels && eventData.id !== p.id) {
          for (const panel of p.panelModels) {
            for (const thisPresentationPanel of eventData.panelModels) {
              if (thisPresentationPanel.id === panel.id) {
                if ((new Date(p.startTime).valueOf() < new Date(eventData.endTime).valueOf())
                  && new Date(eventData.startTime).valueOf() < (new Date(p.endTime).valueOf())) {
                  this.store.dispatch(new ShowSnackBar('Unable to schedule. Panel of this presentation are schedule in other presentation of this time range'));
                  args.cancel = true;
                  return;
                }
              }
            }
          }
        }
      }
    }
  }

  onActionComplete(args: ActionEventArgs): void {

  }

  isMaster(): boolean {
    return this.scheduleType === ScheduleType.MASTER_DISSERTATION;
  }

  getRoomName(id: number): string {
    for (const r of this.presentationSlotScheduler.resourceDataSource) {
      if (r.id === id) {
        return r.name;
      }
    }
    return '';
  }

  get SystemRole() {
    return SystemRole;
  }

  clearAllCheckBox() {
    this.presentationModels.forEach(p => {
      p.online = false;
      p.physical = false;
    });
  }

  checkAllOnline() {
    this.presentationModels.forEach(p => {
      p.online = true;
      p.physical = false;
    });
  }

  checkAllPhysical() {
    this.presentationModels.forEach(p => {
      p.online = false;
      p.physical = true;
    });
  }
}
