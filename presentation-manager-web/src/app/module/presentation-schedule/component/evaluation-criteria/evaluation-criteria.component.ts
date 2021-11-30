import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {EvaluationFormService} from '../../../../service/evluation-form.service';
import {EvaluationFormMode, EvaluationFormModel, EvaluationType} from '../../../../model/evaluation-form.model';
import {Constant} from '../../../../../assets/constant/app.constant';
import {CriteriaModel} from '../../../../model/criteria.model';
import {MatTable} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Select, Store} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable} from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ChangeEvaluationFormMode, ChangeEvaluationType} from '../../../../store/evaluation/evaluation.action';
import {EvaluationState} from '../../../../store/evaluation/evaluation.store';

@Component({
  selector: 'app-evaluation-criteria',
  templateUrl: './evaluation-criteria.component.html',
  styleUrls: ['./evaluation-criteria.component.css']
})
export class EvaluationCriteriaComponent implements OnInit {
  displayedColumns: string[] = ['position', 'criteria', 'weightage', 'max', 'delete'];
  @ViewChild(MatTable) table: MatTable<CriteriaModel>;
  @Input() scheduleId: number;
  evaluationFormModel: EvaluationFormModel;
  criteriaModels: CriteriaModel[] = [];
  fypEvaluationType = [EvaluationType.PRESENTATION, EvaluationType.REPORT];
  selectedEvaluationType = this.fypEvaluationType[0];
  scaleOptions = [1, 2, 3, 4, 5];
  totalWeightage = 0;
  evaluationFormMode = EvaluationFormMode.VIEW;

  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;
  @Select(EvaluationState.getEvaluationFormMode)
  evaluationFormMode$: Observable<EvaluationFormMode>;

  constructor(private evaluationFormService: EvaluationFormService, private matSnackBar: MatSnackBar, private store: Store) {
  }

  ngOnInit(): void {
    this.scheduleId$.subscribe(id => {
      this.scheduleId = id;
      this.store.dispatch(new ChangeEvaluationType(this.fypEvaluationType[0]));
      // this.loadEvaluationForm(this.fypEvaluationType[0]);
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

}
