import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ActionEventArgs,
  CellClickEventArgs,
  EventClickArgs,
  EventRenderedArgs,
  EventSettingsModel,
  ScheduleComponent,
  View
} from '@syncfusion/ej2-angular-schedule';
import {AvailabilityModel, SchedulerAvailabilityModel, UserAvailabilityModel} from '../../../../model/availability/availability.model';
import {AvailabilityService} from '../../../../service/availability.service';
import {Store} from '@ngxs/store';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {Constant} from '../../../../../assets/constant/app.constant';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-view-user-availability',
  templateUrl: './view-user-availability.component.html',
  styleUrls: ['./view-user-availability.component.css']
})
export class ViewUserAvailabilityComponent implements OnInit {
  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
  public userAvailabilityModel: UserAvailabilityModel;
  startHour = Constant.SCHEDULER_START_HOUR;
  endHour = Constant.SCHEDULER_END_HOUR;
  public setView: View = 'Week';
  public showQuickInfo = false;
  public availabilityModels: SchedulerAvailabilityModel[] = [];
  public selectedDate: Date = new Date();
  public dataSource: Record<string, any>[] = [];
  public eventSettings: EventSettingsModel;
  public slotData: SchedulerAvailabilityModel = new SchedulerAvailabilityModel(new AvailabilityModel());

  constructor(private availabilityService: AvailabilityService,
              private store: Store, private dialogUtil: LoadingDialogUtil,
              private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params) {
        const dialogRef = this.dialogUtil.openLoadingDialog();
        const userId = params.id;
        this.availabilityService.getUserAvailabilities(userId).subscribe(resp => {
          if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
            this.availabilityModels = [];
            this.userAvailabilityModel = resp.data;
            console.log(resp.data);
            this.userAvailabilityModel.availabilityModels.forEach(a => {
              const displayModel = new SchedulerAvailabilityModel(a as AvailabilityModel);
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
              enableTooltip: true,
              allowEditing: false,
            };
            this.eventSettings.dataSource = this.availabilityModels;
          }

          dialogRef.close();
        });
      }
    });
  }

  onActionComplete(args: ActionEventArgs): void {
  }


  onEventClick(args: EventClickArgs): void {
    args.cancel = true;
  }

  disablePopupOpen(args): void {
    args.cancel = true;
  }

  onCellClick(args: CellClickEventArgs): void {
    args.cancel = true;
  }

  onPopupClose(): void {
    this.slotData = new SchedulerAvailabilityModel(new AvailabilityModel());
  }

  onEventRendered(args: EventRenderedArgs): void {
    args.element.style.backgroundColor = Constant.SCHEDULER_COLOR_1;
  }

  buttonClickActions(e: Event): void {
  }


}
