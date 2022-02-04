import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoadingDialogComponent} from '../../../../component/loading-dialog/loading-dialog.component';
import {Constant} from '../../../../../assets/constant/app.constant';
import {ScheduleModel, ScheduleType} from '../../../../model/schedule/schedule.model';
import {ScheduleService} from '../../../../service/schedule.service';
import {Store} from '@ngxs/store';
import {ShowSnackBar} from '../../../../store/app/app.action';

@Component({
  selector: 'app-edit-schedule-dialog',
  templateUrl: './edit-schedule-dialog.component.html',
  styleUrls: ['./edit-schedule-dialog.component.css']
})
export class EditScheduleDialogComponent implements OnInit {
  editForm: FormGroup;
  readonly TITLE = 'title';
  readonly YEAR = 'year';
  readonly SEM = 'sem';
  academicYearsSelection = [];
  semSelection = [1, 2];
  currentYear = (new Date()).getFullYear();


  constructor(private loadingUtil: LoadingDialogUtil,
              private matSnackBar: MatSnackBar,
              public dialogRef: MatDialogRef<LoadingDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public scheduleModel: ScheduleModel,
              private formBuilder: FormBuilder,
              private scheduleService: ScheduleService,
              private store: Store) {
  }

  ngOnInit(): void {
    console.log(this.scheduleModel);
    for (let i = -1; i < 9; i++) {
      this.academicYearsSelection.push(this.currentYear + i);
    }
    this.editForm = this.formBuilder.group({
      title: this.formBuilder.control(this.scheduleModel.title, Validators.required),
      year: this.formBuilder.control(this.scheduleModel.year, Validators.required),
      sem: this.formBuilder.control(this.scheduleModel.sem, Validators.required),
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      const loadingRef = this.loadingUtil.openLoadingDialog('Saving...');
      const scheduleModel: ScheduleModel = new ScheduleModel();
      scheduleModel.id = this.scheduleModel.id;
      scheduleModel.title = this.editForm.get(this.TITLE).value;
      scheduleModel.year = this.editForm.get(this.YEAR).value;
      scheduleModel.sem = this.editForm.get(this.SEM).value;

      this.scheduleService.addOrEditSchedule(scheduleModel)
        .subscribe(resp => {
          if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
            this.store.dispatch(new ShowSnackBar('Successfully edited schedule.'));
          } else {
            this.store.dispatch(new ShowSnackBar('Failed to edit schedule.'));
          }
          loadingRef.close();
          this.dialogRef.close({reload: true});
        });
    }

  }

  getScheduleTypeString(type: ScheduleType): string {
    switch (type) {
      case ScheduleType.FYP:
        return 'FYP';
      case ScheduleType.MASTER_DISSERTATION:
        return 'Master Dissertation';
    }
  }

}
