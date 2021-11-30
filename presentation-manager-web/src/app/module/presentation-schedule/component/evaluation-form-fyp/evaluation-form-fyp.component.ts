import {Component, OnInit} from '@angular/core';
import {CriteriaModel} from '../../../../model/criteria.model';
import {EvaluationFormMode, EvaluationFormModel, EvaluationType} from '../../../../model/evaluation-form.model';
import {Select} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable} from 'rxjs';
import {EvaluationFormService} from '../../../../service/evluation-form.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Constant} from '../../../../../assets/constant/app.constant';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {EvaluationState} from '../../../../store/evaluation/evaluation.store';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';

@Component({
  selector: 'app-evaluation-form-fyp',
  templateUrl: './evaluation-form-fyp.component.html',
  styleUrls: ['./evaluation-form-fyp.component.css']
})
export class EvaluationFormFypComponent implements OnInit {
  scheduleId: number;
  evaluationType: EvaluationType;
  evaluationFormModel: EvaluationFormModel;
  criteriaModels: CriteriaModel[] = [];
  scaleOptions = [1, 2, 3, 4, 5];
  totalWeightage = 0;
  evaluationFormMode = EvaluationFormMode.VIEW;

  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;

  @Select(EvaluationState.getEvaluationType)
  evaluationType$: Observable<EvaluationType>;

  @Select(EvaluationState.getEvaluationFormMode)
  evaluationFormMode$: Observable<EvaluationFormMode>;

  constructor(private evaluationFormService: EvaluationFormService, private matSnackBar: MatSnackBar,
              private loadingUtil: LoadingDialogUtil) {
  }

  ngOnInit(): void {
    this.scheduleId$.subscribe(id => {
      this.scheduleId = id;
      this.evaluationType$.subscribe(type => {
          this.evaluationType = type;
          if (this.evaluationType === EvaluationType.PRESENTATION || this.evaluationType === EvaluationType.REPORT) {
            this.loadEvaluationForm(this.evaluationType);
          }
        }
      );
    });
    this.evaluationFormMode$.subscribe(mode => {
      this.evaluationFormMode = mode;
    });
  }

  loadEvaluationForm(evaluationType: EvaluationType): void {
    const loadingRef = this.loadingUtil.openLoadingDialog();
    this.evaluationFormService.getEvaluationForm(this.scheduleId, evaluationType)
      .subscribe(resp => {
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.evaluationFormModel = resp.data;
          console.log(this.evaluationFormModel);
          if (!this.evaluationFormModel.id) {
            this.evaluationFormModel.evaluationType = this.evaluationType;
            this.evaluationFormModel.scheduleId = this.scheduleId;
            this.evaluationFormModel.criteriaModels = [];
            console.log(this.evaluationFormModel);
          }
          this.criteriaModels = this.evaluationFormModel.criteriaModels;
        }
        this.calculateTotalWeightage();
        loadingRef.close();
      });
  }

  calculateTotalWeightage(): void {
    this.totalWeightage = 0;
    this.evaluationFormModel.criteriaModels.forEach(c => {
      if (c.weightage) {
        this.totalWeightage += c.weightage;
      }
    });
  }

  addCriteria(): void {
    const criteriaModel = new CriteriaModel();
    criteriaModel.criteriaOrder = this.criteriaModels.length + 1;
    this.criteriaModels.push(criteriaModel);
    // this.table.renderRows();
    console.log(this.criteriaModels);
  }

  removeCriteria(i: number): void {
    console.log(this.criteriaModels);
    if (this.criteriaModels.length > 1) {
      this.criteriaModels.forEach((element, index) => {
        if (index === i) {
          this.criteriaModels.splice(index, 1);
        }
      });
    }
    this.calculateTotalWeightage();
    // this.table.renderRows();
  }

  isFypPresentation(): boolean {
    return this.evaluationType === EvaluationType.PRESENTATION;
  }

  save(): void {
    console.log(this.evaluationFormModel);
    this.evaluationFormService
      .addOrEditEvaluationForm(this.evaluationFormModel)
      .subscribe(resp => {
        console.log(resp);
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.openSnackBar('Successfully Save Evaluation Criteria');
        }
      });
  }

  openSnackBar(message: string): void {
    this.matSnackBar.open(message, 'dismiss', {
      duration: 5000,
      verticalPosition: 'top'
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.criteriaModels, event.previousIndex, event.currentIndex);
  }

  isEditMode(): boolean {
    return this.evaluationFormMode === EvaluationFormMode.EDIT;
  }

  isViewMode(): boolean {
    return this.evaluationFormMode === EvaluationFormMode.VIEW;
  }

  isEvaluateMode(): boolean {
    return this.evaluationFormMode === EvaluationFormMode.EVALUATE;
  }

  get EvaluationFormMode() {
    return EvaluationFormMode;
  }

}
