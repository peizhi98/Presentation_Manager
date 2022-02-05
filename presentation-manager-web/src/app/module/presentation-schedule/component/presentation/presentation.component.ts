import {Component, OnDestroy, OnInit} from '@angular/core';
import {PresentationService} from '../../../../service/presentation.service';
import {Select, Store} from '@ngxs/store';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Constant} from '../../../../../assets/constant/app.constant';
import {RouteConstant} from '../../../../../assets/constant/route.contant';
import {EvaluationType} from '../../../../model/evaluation/evaluation-form.model';
import {SetCurrentPresentation} from '../../../../store/presentation/presentation.action';
import {SystemRole} from '../../../../model/user/user.model';
import {ScheduleType} from '../../../../model/schedule/schedule.model';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable} from 'rxjs';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {PanelModel} from '../../../../model/role/panel.model';
import {ConfirmationDialogComponent} from '../../../../component/confirmation-dialog/confirmation-dialog.component';
import {ShowSnackBar} from '../../../../store/app/app.action';
import {MatDialog} from '@angular/material/dialog';
import {EditPresentationDialogComponent} from '../edit-presentation-dialog/edit-presentation-dialog.component';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})
export class PresentationComponent implements OnInit, OnDestroy {
  presentationId: number;
  presentationModel: PresentationModel;
  timeFormat = Constant.TIME_FORMAT;
  routeConstant = RouteConstant;
  constant = Constant;
  scheduleType: ScheduleType;
  @Select(ScheduleState.getScheduleType)
  scheduleType$: Observable<ScheduleType>;

  constructor(private presentationService: PresentationService,
              private store: Store,
              private activatedRoute: ActivatedRoute,
              private loadingUtil: LoadingDialogUtil,
              private dialog: MatDialog,
              private router: Router) {
  }

  ngOnDestroy(): void {
    this.store.dispatch(new SetCurrentPresentation(null, new PresentationModel(), null, null, null));
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params) {
        this.presentationId = params.id;
        const loadingRef = this.loadingUtil.openLoadingDialog();
        this.presentationService
          .getPresentation(this.presentationId)
          .subscribe(resp => {
            if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
              this.store.dispatch(new SetCurrentPresentation(this.presentationId, resp.data, resp.data.supervisorModel, resp.data.panelModels, resp.data.chairperson));
              this.presentationModel = resp.data;
              console.log(this.presentationModel);
            }
            console.log(resp);
            loadingRef.close();
          });
      }
    });
    this.scheduleType$.subscribe(type => {
      console.log('this.scheduleType');
      console.log(this.scheduleType);
      this.scheduleType = type;
    });

  }

  getPanelsListString(panels: PanelModel[]): string {
    let str = '';
    if (panels && panels.length !== 0) {
      panels.forEach((p, index) => {
        if (index === 0) {
          str = str + p.name;
        } else {
          str = str + ', ' + p.name;
        }
      });
      return str;
    } else {
      return '-';
    }
  }

  deletePresentationConfirmation(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Are you sure to delete this presentation? ',
    });
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.presentationService.deletePresentation(this.presentationModel.id).subscribe(resp => {
          if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.store.dispatch(new ShowSnackBar('Successfully deleted presentation.'));
          } else {
            this.store.dispatch(new ShowSnackBar('Failed to delete presentation.'));
          }
        });
      }
    });
  }

  editPresentationDialog(): void {
    const dialogRef = this.dialog.open(EditPresentationDialogComponent, {
      data: this.presentationModel,
    });
    dialogRef.afterClosed().subscribe(reload => {
      if (reload) {
        this.ngOnInit();
      }
    });
  }

  get EvaluationType() {
    return EvaluationType;
  }

  get SystemRole() {
    return SystemRole;
  }

  isFyp(): boolean {
    return this.scheduleType === ScheduleType.FYP;
  }

  isMaster(): boolean {
    return this.scheduleType === ScheduleType.MASTER_DISSERTATION;
  }

  getTitle(evaluationType: EvaluationType): string {
    switch (evaluationType) {
      case EvaluationType.PRESENTATION:
        return 'Presentation Assessment Form';
      case EvaluationType.REPORT:
        return 'Supervisor Assessment Form';
      case EvaluationType.PANEL:
        return 'Evaluation Form';
      case EvaluationType.CONFIRMATION:
        return 'Confirmation Panel Evaluation Form';
      default:
        return 'Invalid Form Name';
    }
  }
}
