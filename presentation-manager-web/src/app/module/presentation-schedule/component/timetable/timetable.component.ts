import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ChangeEventArgs} from '@syncfusion/ej2-buttons';
import {
  CellClickEventArgs,
  DragAndDropService,
  DragEventArgs,
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
import {Select} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable} from 'rxjs';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {PresentationModel, PresentationScheduleModel, SchedulerPresentationModel} from '../../../../model/presentation/presentation.model';

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
  selectedDate: Date = new Date(2021, 7, 2);
  rowAutoHeight = true;
  currentView: View = 'TimelineDay';
  group: GroupModel = {
    enableCompactView: false,
    resources: ['MeetingRoom']
  };
  dragging = false;
  allowMultiple = true;
  draggingIndex: number = null;
  draggingPresentation: SchedulerPresentationModel = null;
  disableDrag = false;

  resourceDataSource: Record<string, any>[] = [
    {text: 'Room A', id: 1, color: '#98AFC7'},
    {text: 'Room B', id: 2, color: '#99c68e'},
    {text: 'Room C', id: 3, color: '#C2B280'},
    {text: 'Room D', id: 4, color: '#3090C7'},
    {text: 'Room E', id: 5, color: '#95b9'},
    {text: 'Room F', id: 6, color: '#95b9c7'},
    {text: 'Room G', id: 7, color: '#deb887'},
    {text: 'Room H', id: 8, color: '#3090C7'},
    {text: 'Room I', id: 9, color: '#98AFC7'},
    {text: 'Room J', id: 10, color: '#778899'}
  ];

  eventSettings: EventSettingsModel;
  presentationModels: SchedulerPresentationModel[] = [];
  scheduledPresentations: SchedulerPresentationModel[] = [];

  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;

  constructor(
    private presentationService: PresentationService,
    private loadingUtil: LoadingDialogUtil
  ) {
    // sourceFiles.files = ['adaptive-rows.style.css'];
  }

  onChange(args: ChangeEventArgs): void {
    this.scheduleObj.rowAutoHeight = args.checked;
  }

  ngOnInit(): void {
    const loadingRef = this.loadingUtil.openLoadingDialog();
    this.scheduleId$.subscribe(id => {
      this.presentationService.getPresentations(id).subscribe(res => {
        if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
          (res.data as SchedulerPresentationModel[]).forEach((presentationData, index) => {
            // test!!!!!!!!!!!
            presentationData.roomId = 1;
            const schedulerPresentationModel: SchedulerPresentationModel = new SchedulerPresentationModel();
            schedulerPresentationModel.id = presentationData.id;
            schedulerPresentationModel.roomId = presentationData.roomId;
            schedulerPresentationModel.title = presentationData.title;
            schedulerPresentationModel.panelModels = presentationData.panelModels;
            schedulerPresentationModel.supervisorModel = presentationData.supervisorModel;
            schedulerPresentationModel.startTime = presentationData.startTime;
            schedulerPresentationModel.endTime = presentationData.endTime;
            if (presentationData.startTime && presentationData.endTime) {
              this.scheduledPresentations.push(schedulerPresentationModel);
            } else {
              this.presentationModels.push(schedulerPresentationModel);
            }
          });
          this.eventSettings = {
            fields: {
              id: 'schedulerId',
              subject: {name: 'title', title: 'Title'},
              // location: {name: 'Location', title: 'Location'},
              // description: {name: 'Description', title: 'Comments'},
              startTime: {name: 'startTime', title: 'From'},
              endTime: {name: 'endTime', title: 'To'}
            },
            enableTooltip: true
          };
          // const schedulerPresentationModels: SchedulerPresentationModel[] = [];
          // this.eventSettings.dataSource = schedulerPresentationModels;
          this.eventSettings.dataSource = this.scheduledPresentations;
          loadingRef.close();
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

  onSchedulerDragStart(args: DragEventArgs): void {
    args.interval = 5;
    args.navigation.enable = true;
  }

  onResizeStart(args: ResizeEventArgs): void {
    args.interval = 5;
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
        presentationSchedules.push(presentationScheduleModel);
      }
    });
    this.presentationService.schedulePresentations(presentationSchedules).subscribe((resp) => {
      if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {

      }
      loadingDialog.close();
    });
  }
}
