import {Component, OnDestroy, OnInit} from '@angular/core';
import {ScheduleService} from '../../../../service/schedule.service';
import {Store} from '@ngxs/store';
import {ActivatedRoute, Router} from '@angular/router';
import {ScheduleModel, ScheduleType} from '../../../../model/schedule/schedule.model';
import {Constant} from '../../../../../assets/constant/app.constant';
import {RouteConstant} from '../../../../../assets/constant/route.contant';
import {SetCurrentSchedule} from '../../../../store/schedule/schedule.action';
import {Subscription} from 'rxjs';
import {ConfirmationDialogComponent} from '../../../../component/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ShowSnackBar} from '../../../../store/app/app.action';
import {EditScheduleDialogComponent} from '../../component/edit-schedule-dialog/edit-schedule-dialog.component';
import {SystemRole} from '../../../../model/user/user.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  navLinks = [];
  activeLinkIndex = -1;
  scheduleModel: ScheduleModel;
  loading = true;
  contentTitle = '';
  scheduleId: number;
  constant = Constant;
  routeConstant = RouteConstant;
  subs: Subscription[] = [];
  permissionsToNavbar = [];
  activeLink = '';

  constructor(private scheduleService: ScheduleService,
              private activatedRoute: ActivatedRoute,
              private store: Store,
              private router: Router,
              private dialog: MatDialog) {
    this.navLinks = [
      {
        label: 'Presentation',
        link: RouteConstant.PRESENTATION_VIEW,
        index: 0
      }, {
        label: 'Timetable',
        link: RouteConstant.TIMETABLE,
        index: 1
      },
      // {
      //   label: 'Evaluation',
      //   link: 'RouteConstant.CRITERIA',
      //   index: 2
      // },
      {
        label: 'Evaluation Criteria',
        link: RouteConstant.CRITERIA,
        index: 2
      },
      {
        label: 'Evaluation Report',
        link: RouteConstant.EVALUATION_VIEW,
        index: 3
      },
      {
        label: 'Google Calendar',
        link: RouteConstant.GOOGLE_CALENDAR,
        index: 4
      },
      // {
      //   label: 'Details',
      //   link: './details',
      //   index: 5
      // },
    ];
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => {
      s.unsubscribe();
    });

  }

  ngOnInit(): void {
    // this.router.events.subscribe((res) => {
    //   this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    // });

    this.subs.push(this.activatedRoute.params.subscribe(params => {
      if (params) {
        this.scheduleId = params.id;
        this.scheduleService.getSchedule(this.scheduleId).subscribe(resp => {
          if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
            this.scheduleModel = resp.data;
            console.log(this.scheduleModel.title);
            this.store.dispatch(new SetCurrentSchedule(this.scheduleId, resp.data.coordinator, this.scheduleModel.scheduleType, this.scheduleModel.title));
            if (this.scheduleModel.scheduleType === ScheduleType.MASTER_DISSERTATION) {
              this.permissionsToNavbar = [Constant.ROLE_SCHEDULE_COORDINATOR, SystemRole.OFFICE];
            } else {
              this.permissionsToNavbar = [Constant.ROLE_SCHEDULE_COORDINATOR];
            }
            this.loading = false;
          }
        });
      }
    }));
  }

  deleteScheduleConfirmation(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Are you sure to delete this schedule? ',
    });
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.scheduleService.deleteSchedule(this.scheduleModel.id).subscribe(resp => {
          if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.store.dispatch(new ShowSnackBar('Successfully deleted schedule.'));
          } else {
            this.store.dispatch(new ShowSnackBar('Failed to delete schedule.'));
          }
        });
      }
    });
  }

  showEditDialog(): void {
    const dialogRef = this.dialog.open(EditScheduleDialogComponent, {
      data: this.scheduleModel,
    });
    dialogRef.afterClosed().subscribe(reload => {
      if (reload) {
        this.ngOnInit();
      }
    });
  }

  get SystemRole() {
    return SystemRole;
  }

}
