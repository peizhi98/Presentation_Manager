import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoadingDialogComponent} from '../../../../component/loading-dialog/loading-dialog.component';
import {ScheduleType} from '../../../../model/schedule/schedule.model';
import {Select, Store} from '@ngxs/store';
import {Constant} from '../../../../../assets/constant/app.constant';
import {ShowSnackBar} from '../../../../store/app/app.action';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {PresentationService} from '../../../../service/presentation.service';
import {LecturerModel} from '../../../../model/role/lecturer.model';
import {UserState} from '../../../../store/user/user.store';
import {Observable, Subscription} from 'rxjs';
import {PatchLecturerFromBackend} from '../../../../store/user/user.action';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {PanelModel} from '../../../../model/role/panel.model';
import {SupervisorModel} from '../../../../model/role/supervisor.model';

@Component({
  selector: 'app-edit-presentation-dialog',
  templateUrl: './edit-presentation-dialog.component.html',
  styleUrls: ['./edit-presentation-dialog.component.css']
})
export class EditPresentationDialogComponent implements OnInit, OnDestroy {
  lecturers: LecturerModel[] = [];
  filteredLecturers: LecturerModel[] = [];
  scheduleType: ScheduleType;
  @Select(UserState.getLecturer)
  lecturers$: Observable<LecturerModel[]>;
  @Select(ScheduleState.getScheduleType)
  scheduleType$: Observable<ScheduleType>;

  subs: Subscription[] = [];

  constructor(private loadingUtil: LoadingDialogUtil,
              private matSnackBar: MatSnackBar,
              public dialogRef: MatDialogRef<LoadingDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public presentation: PresentationModel,
              private formBuilder: FormBuilder,
              private presentationService: PresentationService,
              private store: Store) {
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => {
      s.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new PatchLecturerFromBackend());
    this.subs.push(this.lecturers$.subscribe(lec => {
      this.lecturers = lec;
    }));
    this.subs.push(this.scheduleType$.subscribe(type => {
      this.scheduleType = type;
    }));
    if (!this.presentation.supervisorModel) {
      this.presentation.supervisorModel = new SupervisorModel();
    }
    if (!this.presentation.chairperson) {
      this.presentation.chairperson = new PanelModel();
    }
    if (!this.presentation.panelModels) {
      this.presentation.panelModels = [];
      this.presentation.panelModels.push(new PanelModel());
      this.presentation.panelModels.push(new PanelModel());
    }

  }

  onSubmit() {
    if (this.presentation.panelModels) {
      for (const panels of this.presentation.panelModels) {
        let counter = 0;
        for (const otherPanels of this.presentation.panelModels) {
          if (panels.email === otherPanels.email) {
            counter++;
          }
          if (counter === 2) {
            this.store.dispatch(new ShowSnackBar('Same panel assigned more than once to a presentation. Please assign other panel.'));
            return;
          }
        }
      }
    }
    const loadingRef = this.loadingUtil.openLoadingDialog('Saving...');

    this.presentationService.editPresentation(this.presentation)
      .subscribe(resp => {
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.store.dispatch(new ShowSnackBar('Successfully edited presentation.'));
          this.dialogRef.close({reload: true});
        } else {
          this.store.dispatch(new ShowSnackBar('Failed to edit presentation.'));
        }
        loadingRef.close();
      });

  }

  applyFilter(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filteredLecturers = inputValue ? this.filterLecturers(inputValue) : this.lecturers.slice();
  }

  private filterLecturers(value: string): LecturerModel[] {
    const filterValue = value.trim().toLowerCase();
    const filteredLec = [];
    this.lecturers.forEach(lec => {
      const searchSpace = (lec.name) ? (lec.name + lec.email) : lec.email;
      if (searchSpace.trim().toLowerCase().includes(filterValue)) {
        filteredLec.push(lec);
      }
    });
    return filteredLec;
  }

  removePanel(panelModels: PanelModel[], i: number): void {
    if (panelModels.length > 1) {
      panelModels.forEach((element, index) => {
        if (index === i) {
          panelModels.splice(index, 1);
        }
      });
    }
  }

  addPanel(presentationModel: PresentationModel): void {
    presentationModel.panelModels.push(new PanelModel());
  }

  isMaster(): boolean {
    return this.scheduleType === ScheduleType.MASTER_DISSERTATION;
  }
}
