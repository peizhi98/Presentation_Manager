import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {EvaluationFormService} from '../../../../service/evluation-form.service';
import {EvaluationFormMode, EvaluationFormModel, EvaluationType} from '../../../../model/evaluation/evaluation-form.model';
import {Constant} from '../../../../../assets/constant/app.constant';
import {CriterionModel} from '../../../../model/evaluation/criterion.model';
import {MatTable} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Select, Store} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable} from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ChangeEvaluationFormMode, ChangeEvaluationType} from '../../../../store/evaluation/evaluation.action';
import {EvaluationState} from '../../../../store/evaluation/evaluation.store';
import {ScheduleType} from '../../../../model/schedule/schedule.model';

@Component({
  selector: 'app-evaluation-criteria',
  templateUrl: './evaluation-criteria.component.html',
  styleUrls: ['./evaluation-criteria.component.css']
})
export class EvaluationCriteriaComponent implements OnInit {
  displayedColumns: string[] = ['position', 'criteria', 'weightage', 'max', 'delete'];
  @ViewChild(MatTable) table: MatTable<CriterionModel>;
  @Input() scheduleId: number;
  @Input() scheduleType: ScheduleType;
  evaluationFormModel: EvaluationFormModel;
  criteriaModels: CriterionModel[] = [];
  fypEvaluationType = [EvaluationType.PRESENTATION, EvaluationType.REPORT];
  masterEvaluationType = [EvaluationType.PANEL, EvaluationType.CONFIRMATION];
  selectedEvaluationType = null;
  scaleOptions = [1, 2, 3, 4, 5];
  totalWeightage = 0;
  evaluationFormMode = EvaluationFormMode.VIEW;

  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;
  @Select(ScheduleState.getScheduleType)
  scheduleType$: Observable<ScheduleType>;
  @Select(EvaluationState.getEvaluationFormMode)
  evaluationFormMode$: Observable<EvaluationFormMode>;

  constructor(private evaluationFormService: EvaluationFormService, private matSnackBar: MatSnackBar, private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new ChangeEvaluationFormMode(EvaluationFormMode.VIEW));
    this.scheduleId$.subscribe(id => {
      if (id) {
        this.scheduleId = id;
        this.scheduleType$.subscribe(type => {
          console.log('this.scheduleType');
          console.log(this.scheduleType);
          this.scheduleType = type;
          if (this.scheduleType === ScheduleType.FYP) {
            this.selectedEvaluationType = this.fypEvaluationType[0];
          } else {
            this.selectedEvaluationType = this.masterEvaluationType[0];
          }
          this.store.dispatch(new ChangeEvaluationType(this.selectedEvaluationType));
        });
        // this.loadEvaluationForm(this.fypEvaluationType[0]);
      }

    });
    this.evaluationFormMode$.subscribe(mode => {
      this.evaluationFormMode = mode;
    });
  }

  loadEvaluationForm(evaluationType: EvaluationType): void {
    // this.evaluationFormService.getEvaluationForm(this.scheduleId, evaluationType)
    //   .subscribe(resp => {
    //     if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
    //       this.evaluationFormModel = resp.data;
    //       console.log(this.evaluationFormModel);
    //       if (!this.evaluationFormModel.id) {
    //         this.evaluationFormModel.evaluationType = this.selectedEvaluationType;
    //         this.evaluationFormModel.scheduleId = this.scheduleId;
    //         this.evaluationFormModel.criteriaModels = [];
    //         console.log(this.evaluationFormModel);
    //       }
    //       this.criteriaModels = this.evaluationFormModel.criteriaModels;
    //     }
    //     this.calculateTotalWeightage();
    //   });
    this.store.dispatch(new ChangeEvaluationType(evaluationType));
  }

  calculateTotalWeightage(): void {
    this.totalWeightage = 0;
    this.evaluationFormModel.criterionModels.forEach(c => {
      if (c.weightage) {
        this.totalWeightage += c.weightage;
      }
    });
  }

  addCriteria(): void {
    const criteriaModel = new CriterionModel();
    criteriaModel.position = this.criteriaModels.length + 1;
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
    return this.selectedEvaluationType === EvaluationType.PRESENTATION;
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

  enterEditMode() {
    this.store.dispatch(new ChangeEvaluationFormMode(EvaluationFormMode.EDIT));
  }

  enterViewMode() {
    this.store.dispatch(new ChangeEvaluationFormMode(EvaluationFormMode.VIEW));
  }

  isEditMode(): boolean {
    return this.evaluationFormMode === EvaluationFormMode.EDIT;
  }

  isViewMode(): boolean {
    return this.evaluationFormMode === EvaluationFormMode.VIEW;
  }

  isFyp(): boolean {
    return this.scheduleType === ScheduleType.FYP;
  }

  isMaster(): boolean {
    return this.scheduleType === ScheduleType.MASTER_DISSERTATION;
  }

  get EvaluationType() {
    return EvaluationType;
  }

  getTitle(evaluationType:EvaluationType): string {
    switch (evaluationType) {
      case EvaluationType.PRESENTATION:
        return 'VIVA Assessment Form';
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
